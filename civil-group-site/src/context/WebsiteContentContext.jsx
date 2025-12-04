import { createContext, useContext, useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import { useAuth } from './AuthContext';

const WebsiteContentContext = createContext();

export const useWebsiteContent = () => {
  const context = useContext(WebsiteContentContext);
  if (!context) {
    throw new Error('useWebsiteContent must be used within WebsiteContentProvider');
  }
  return context;
};

const defaultContent = {
  hero: {
    title: 'Welcome to Simmons Civil Group Inc',
    subtitle: 'Quality Construction Services You Can Trust',
    backgroundImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80'
  },
  about: {
    title: 'About Us',
    subtitle: '25+ Years of Excellence',
    text1: 'Simmons Civil Group Inc has been providing top-quality construction and utility services for over 25 years. Our commitment to excellence, safety, and client satisfaction sets us apart in the industry.',
    text2: 'We pride ourselves on building lasting relationships with our clients through reliable service, quality workmanship, and attention to detail on every project.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
  },
  services: {
    title: 'Our Services',
    items: [
      { id: 1, title: 'Grading', description: 'Professional land grading and site preparation services' },
      { id: 2, title: 'Paving', description: 'High-quality asphalt and concrete paving solutions' },
      { id: 3, title: 'Concrete Work', description: 'Expert concrete installation and finishing' },
      { id: 4, title: 'Water & Sewer', description: 'Complete water and sewer line installation and repair' },
      { id: 5, title: 'Storm Drain', description: 'Storm drainage system design and installation' },
      { id: 6, title: 'Utility Installation', description: 'Professional utility service installation' }
    ]
  },
  gallery: {
    title: 'Our Projects',
    subtitle: 'Take a look at some of our recent work',
    images: [
      { id: 1, url: 'https://images.unsplash.com/photo-1590496793907-892f56b5d9af?w=600&q=80', caption: 'Road Construction' },
      { id: 2, url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80', caption: 'Site Preparation' },
      { id: 3, url: 'https://images.unsplash.com/photo-1597476470008-bd530f940c45?w=600&q=80', caption: 'Heavy Equipment' },
      { id: 4, url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80', caption: 'Construction Site' },
      { id: 5, url: 'https://images.unsplash.com/photo-1621875688671-0d3c47f68c23?w=600&q=80', caption: 'Excavation Work' },
      { id: 6, url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80', caption: 'Utility Installation' }
    ]
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Get In Touch',
    address: '123 Main Street\nYour City, ST 12345',
    phone: '(910) 782-8325',
    hours: 'Monday - Friday: 8:00 AM - 5:00 PM'
  },
  navbar: {
    companyName: 'Simmons Civil Group Inc',
    phone: '(910) 782-8325'
  }
};

export const WebsiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load content from content.json in public folder with cache-busting
      const response = await fetch(`/content.json?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        // Use default content if file doesn't exist
        setContent(defaultContent);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent(defaultContent);
    } finally {
      setLoading(false);
    }
  };

  const commitToGitHub = async (newContent, commitMessage) => {
    // Check if another save is in progress
    if (isSaving) {
      return {
        success: false,
        error: 'Please wait until the previous change has finished deploying before making another edit.'
      };
    }

    setIsSaving(true);

    try {
      const maxRetries = 3;
      let attempt = 0;

      while (attempt < maxRetries) {
        try {
          const token = import.meta.env.VITE_GITHUB_TOKEN;
          const owner = import.meta.env.VITE_GITHUB_OWNER;
          const repo = import.meta.env.VITE_GITHUB_REPO;
          const path = 'civil-group-site/public/content.json';
          const branch = 'main';

          if (!token || !owner || !repo) {
            throw new Error('Missing GitHub configuration. Please check environment variables.');
          }

          const octokit = new Octokit({
            auth: token
          });

          // Get the latest file SHA right before committing
          const { data: currentFile } = await octokit.repos.getContent({
            owner,
            repo,
            path,
            ref: branch
          });

          // Update the file with the latest SHA
          await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: commitMessage,
            content: btoa(JSON.stringify(newContent, null, 2)),
            sha: currentFile.sha,
            branch
          });

          console.log('Commit successful! Waiting for Vercel deployment...');

          // Wait 5 seconds for Vercel to start deploying, then reload content
          await new Promise(resolve => setTimeout(resolve, 5000));
          await loadContent();

          setIsSaving(false);
          return { success: true };
        } catch (error) {
          attempt++;
          console.error(`Commit attempt ${attempt} failed:`, error.message);

          // If it's a SHA mismatch error and we have retries left, try again
          if (error.message.includes('does not match') && attempt < maxRetries) {
            console.log('SHA mismatch detected, retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
            continue;
          }

          // If it's a different error or we're out of retries, give up
          console.error('Error committing to GitHub:', error);
          setIsSaving(false);

          // Return user-friendly error message
          if (error.message.includes('does not match')) {
            return {
              success: false,
              error: 'Please wait until the previous change has finished deploying before making another edit.'
            };
          }

          return { success: false, error: 'Failed to save changes. Please try again.' };
        }
      }

      setIsSaving(false);
      return {
        success: false,
        error: 'Please wait until the previous change has finished deploying before making another edit.'
      };
    } catch (error) {
      setIsSaving(false);
      return { success: false, error: 'Failed to save changes. Please try again.' };
    }
  };

  const updateContent = async (section, field, value) => {
    try {
      const newContent = { ...content };

      if (field.includes('.')) {
        // Handle nested fields like "items.0.title"
        const parts = field.split('.');
        let current = newContent[section];
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
      } else {
        newContent[section][field] = value;
      }

      setContent(newContent);

      // Commit to GitHub
      const commitMessage = `Update ${section}.${field} via admin panel`;
      const result = await commitToGitHub(newContent, commitMessage);

      return result;
    } catch (error) {
      console.error('Error updating content:', error);
      return { success: false, error: error.message };
    }
  };

  const addServiceItem = async (newService) => {
    try {
      const newContent = { ...content };
      const maxId = Math.max(...newContent.services.items.map(s => s.id), 0);
      newContent.services.items.push({
        id: maxId + 1,
        ...newService
      });

      setContent(newContent);

      const commitMessage = `Add service: ${newService.title} via admin panel`;
      const result = await commitToGitHub(newContent, commitMessage);

      return result;
    } catch (error) {
      console.error('Error adding service:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteServiceItem = async (serviceId) => {
    try {
      const newContent = { ...content };
      const service = newContent.services.items.find(s => s.id === serviceId);
      newContent.services.items = newContent.services.items.filter(s => s.id !== serviceId);

      setContent(newContent);

      const commitMessage = `Delete service: ${service?.title || serviceId} via admin panel`;
      const result = await commitToGitHub(newContent, commitMessage);

      return result;
    } catch (error) {
      console.error('Error deleting service:', error);
      return { success: false, error: error.message };
    }
  };

  const addGalleryImage = async (newImage) => {
    try {
      const newContent = { ...content };
      const maxId = Math.max(...newContent.gallery.images.map(img => img.id), 0);
      newContent.gallery.images.push({
        id: maxId + 1,
        ...newImage
      });

      setContent(newContent);

      const commitMessage = `Add gallery image: ${newImage.caption} via admin panel`;
      const result = await commitToGitHub(newContent, commitMessage);

      return result;
    } catch (error) {
      console.error('Error adding gallery image:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteGalleryImage = async (imageId) => {
    try {
      const newContent = { ...content };
      const image = newContent.gallery.images.find(img => img.id === imageId);
      newContent.gallery.images = newContent.gallery.images.filter(img => img.id !== imageId);

      setContent(newContent);

      const commitMessage = `Delete gallery image: ${image?.caption || imageId} via admin panel`;
      const result = await commitToGitHub(newContent, commitMessage);

      return result;
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      return { success: false, error: error.message };
    }
  };

  const updateGalleryImage = async (imageId, updates) => {
    try {
      const newContent = { ...content };
      const imageIndex = newContent.gallery.images.findIndex(img => img.id === imageId);
      if (imageIndex !== -1) {
        newContent.gallery.images[imageIndex] = {
          ...newContent.gallery.images[imageIndex],
          ...updates
        };
      }

      setContent(newContent);

      const commitMessage = `Update gallery image: ${updates.caption || imageId} via admin panel`;
      const result = await commitToGitHub(newContent, commitMessage);

      return result;
    } catch (error) {
      console.error('Error updating gallery image:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleEditMode = () => {
    if (isAdmin) {
      setEditMode(!editMode);
    }
  };

  const value = {
    content,
    loading,
    editMode,
    isSaving,
    toggleEditMode,
    updateContent,
    addServiceItem,
    deleteServiceItem,
    addGalleryImage,
    deleteGalleryImage,
    updateGalleryImage
  };

  return (
    <WebsiteContentContext.Provider value={value}>
      {children}
    </WebsiteContentContext.Provider>
  );
};

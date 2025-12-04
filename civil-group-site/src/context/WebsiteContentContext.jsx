import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
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
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const docRef = doc(db, 'siteContent', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setContent(docSnap.data());
      } else {
        // Initialize with default content
        await setDoc(docRef, defaultContent);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
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

      // Save to Firestore
      const docRef = doc(db, 'siteContent', 'main');
      await setDoc(docRef, newContent);

      return { success: true };
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

      const docRef = doc(db, 'siteContent', 'main');
      await setDoc(docRef, newContent);

      return { success: true };
    } catch (error) {
      console.error('Error adding service:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteServiceItem = async (serviceId) => {
    try {
      const newContent = { ...content };
      newContent.services.items = newContent.services.items.filter(s => s.id !== serviceId);

      setContent(newContent);

      const docRef = doc(db, 'siteContent', 'main');
      await setDoc(docRef, newContent);

      return { success: true };
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

      const docRef = doc(db, 'siteContent', 'main');
      await setDoc(docRef, newContent);

      return { success: true };
    } catch (error) {
      console.error('Error adding gallery image:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteGalleryImage = async (imageId) => {
    try {
      const newContent = { ...content };
      newContent.gallery.images = newContent.gallery.images.filter(img => img.id !== imageId);

      setContent(newContent);

      const docRef = doc(db, 'siteContent', 'main');
      await setDoc(docRef, newContent);

      return { success: true };
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

      const docRef = doc(db, 'siteContent', 'main');
      await setDoc(docRef, newContent);

      return { success: true };
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

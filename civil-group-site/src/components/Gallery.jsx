import { useState } from 'react';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import EditableText from './EditableText';
import './Gallery.css';

const Gallery = () => {
  const { content, editMode, addGalleryImage, deleteGalleryImage, updateGalleryImage } = useWebsiteContent();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url');
  const [lightboxImage, setLightboxImage] = useState(null);

  const handleAddImage = async () => {
    if (uploadMethod === 'url') {
      if (!newImageUrl.trim()) {
        alert('Please enter an image URL');
        return;
      }

      setUploading(true);
      const result = await addGalleryImage({
        url: newImageUrl,
        caption: newImageCaption || 'Project Photo'
      });
      setUploading(false);

      if (result.success) {
        setShowAddModal(false);
        setNewImageUrl('');
        setNewImageCaption('');
      } else {
        alert('Failed to add image: ' + result.error);
      }
    } else {
      if (!imageFile) {
        alert('Please select an image file');
        return;
      }

      if (imageFile.size > 32 * 1024 * 1024) {
        alert('Image size must be less than 32MB');
        return;
      }

      setUploading(true);

      try {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);

        reader.onload = async () => {
          try {
            const base64Image = reader.result.split(',')[1];
            const formData = new FormData();
            formData.append('image', base64Image);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
              method: 'POST',
              body: formData
            });

            const data = await response.json();

            if (data.success) {
              const uploadedUrl = data.data.url;
              const result = await addGalleryImage({
                url: uploadedUrl,
                caption: newImageCaption || 'Project Photo'
              });

              if (result.success) {
                setShowAddModal(false);
                setNewImageUrl('');
                setNewImageCaption('');
                setImageFile(null);
              } else {
                alert('Failed to add image: ' + result.error);
              }
            } else {
              alert('Failed to upload image to ImgBB');
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image: ' + error.message);
          } finally {
            setUploading(false);
          }
        };

        reader.onerror = () => {
          alert('Failed to read image file');
          setUploading(false);
        };
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image');
        setUploading(false);
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    const result = await deleteGalleryImage(imageId);
    if (!result.success) {
      alert('Failed to delete image: ' + result.error);
    }
  };

  const handleUpdateCaption = async () => {
    if (!selectedImage) return;

    setUploading(true);
    const result = await updateGalleryImage(selectedImage.id, {
      caption: newImageCaption
    });
    setUploading(false);

    if (result.success) {
      setShowEditModal(false);
      setSelectedImage(null);
      setNewImageCaption('');
    } else {
      alert('Failed to update caption: ' + result.error);
    }
  };

  const openEditModal = (image) => {
    setSelectedImage(image);
    setNewImageCaption(image.caption);
    setShowEditModal(true);
  };

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <EditableText section="gallery" field="title" as="h2">
          {content.gallery.title}
        </EditableText>
        <EditableText section="gallery" field="subtitle" as="p" className="gallery-subtitle">
          {content.gallery.subtitle}
        </EditableText>

        <div className="gallery-grid">
          {content.gallery.images.map((image) => (
            <div key={image.id} className="gallery-item">
              <img
                src={image.url}
                alt={image.caption}
                onClick={() => setLightboxImage(image)}
              />
              <div className="gallery-caption">{image.caption}</div>
              {editMode && (
                <div className="gallery-item-actions">
                  <button onClick={() => openEditModal(image)} className="edit-caption-btn">
                    Edit Caption
                  </button>
                  <button onClick={() => handleDeleteImage(image.id)} className="delete-img-btn">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {editMode && (
          <button onClick={() => setShowAddModal(true)} className="add-gallery-btn">
            + Add Image to Gallery
          </button>
        )}
      </div>

      {/* Add Image Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Image to Gallery</h3>

            <div className="upload-method-toggle">
              <button
                className={uploadMethod === 'url' ? 'active' : ''}
                onClick={() => setUploadMethod('url')}
              >
                Image URL
              </button>
              <button
                className={uploadMethod === 'upload' ? 'active' : ''}
                onClick={() => setUploadMethod('upload')}
              >
                Upload Image
              </button>
            </div>

            {uploadMethod === 'url' ? (
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            ) : (
              <div className="form-group">
                <label>Select Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
            )}

            <div className="form-group">
              <label>Caption</label>
              <input
                type="text"
                value={newImageCaption}
                onChange={(e) => setNewImageCaption(e.target.value)}
                placeholder="Project description"
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleAddImage} disabled={uploading} className="save-btn">
                {uploading ? 'Adding...' : 'Add Image'}
              </button>
              <button onClick={() => setShowAddModal(false)} disabled={uploading} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Caption Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Image Caption</h3>

            <div className="form-group">
              <label>Caption</label>
              <input
                type="text"
                value={newImageCaption}
                onChange={(e) => setNewImageCaption(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleUpdateCaption} disabled={uploading} className="save-btn">
                {uploading ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setShowEditModal(false)} disabled={uploading} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
              ×
            </button>
            <img src={lightboxImage.url} alt={lightboxImage.caption} />
            <div className="lightbox-caption">{lightboxImage.caption}</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;

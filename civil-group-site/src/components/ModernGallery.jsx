import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow, EffectCreative } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import EditableText from './EditableText';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-creative';
import './ModernGallery.css';

const ModernGallery = () => {
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('gallery');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

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
    <section id="gallery" className="modern-gallery">
      <div className="gallery-container">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <EditableText section="gallery" field="title" as="h2" className="gallery-title">
            {content.gallery.title}
          </EditableText>
          <EditableText section="gallery" field="subtitle" as="p" className="gallery-subtitle">
            {content.gallery.subtitle}
          </EditableText>
        </motion.div>

        <motion.div
          className="gallery-carousel-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow, EffectCreative]}
            effect="slide"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            loop={true}
            loopAdditionalSlides={2}
            watchSlidesProgress={true}
            preloadImages={true}
            lazy={{
              loadPrevNext: true,
              loadPrevNextAmount: 2,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={600}
            spaceBetween={20}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
                effect: 'slide',
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 15,
                effect: 'slide',
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 0,
                effect: 'coverflow',
                coverflowEffect: {
                  rotate: 30,
                  stretch: 10,
                  depth: 150,
                  modifier: 1,
                  slideShadows: true,
                },
              },
            }}
            className="gallery-swiper"
          >
            {content.gallery.images.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="gallery-slide">
                  <img
                    src={image.url}
                    alt={image.caption}
                    onClick={() => !editMode && setLightboxImage(image)}
                  />
                  <div className="slide-caption">
                    <h3>{image.caption}</h3>
                  </div>
                  {editMode && (
                    <div className="slide-actions">
                      <button onClick={() => openEditModal(image)} className="edit-btn">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeleteImage(image.id)} className="delete-btn">
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {editMode && (
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="add-image-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add Project Image
          </motion.button>
        )}
      </div>

      {/* Modals - same as before */}
      {showAddModal && (
        <div className="premium-modal-overlay" onClick={() => setShowAddModal(false)}>
          <motion.div
            className="premium-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Add Project Image</h3>
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
          </motion.div>
        </div>
      )}

      {showEditModal && (
        <div className="premium-modal-overlay" onClick={() => setShowEditModal(false)}>
          <motion.div
            className="premium-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Edit Caption</h3>
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
          </motion.div>
        </div>
      )}

      {lightboxImage && (
        <div className="premium-lightbox" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close">×</button>
          <motion.div
            className="lightbox-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={lightboxImage.url} alt={lightboxImage.caption} />
            <div className="lightbox-caption">{lightboxImage.caption}</div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ModernGallery;

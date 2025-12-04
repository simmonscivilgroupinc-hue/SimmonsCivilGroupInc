import { useState } from 'react';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import './EditableImage.css';

const EditableImage = ({ section, field, alt, className = '' }) => {
  const { content, editMode, updateContent } = useWebsiteContent();
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'upload'

  // Get the actual value from content
  const getValue = () => {
    if (!content[section]) return '';

    if (field.includes('.')) {
      const parts = field.split('.');
      let value = content[section];
      for (const part of parts) {
        value = value?.[part];
      }
      return value || '';
    }

    return content[section][field] || '';
  };

  const currentImageUrl = getValue();

  const handleClick = (e) => {
    if (editMode && !isEditing) {
      e.preventDefault();
      e.stopPropagation();
      setImageUrl(currentImageUrl);
      setIsEditing(true);
    }
  };

  const handleSaveUrl = async () => {
    if (!imageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    setUploading(true);
    const result = await updateContent(section, field, imageUrl);
    setUploading(false);

    if (result.success) {
      setIsEditing(false);
      setImageUrl('');
    } else {
      alert('Failed to save: ' + result.error);
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (ImgBB free tier max: 32MB)
    if (imageFile.size > 32 * 1024 * 1024) {
      alert('Image size must be less than 32MB');
      return;
    }

    setUploading(true);

    try {
      // Convert image to base64
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
            const result = await updateContent(section, field, uploadedUrl);

            if (result.success) {
              setIsEditing(false);
              setImageFile(null);
            } else {
              alert('Failed to save: ' + result.error);
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
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageUrl('');
    setImageFile(null);
  };

  if (isEditing) {
    return (
      <div className="editable-image-editor">
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
          <div className="url-input-section">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="image-url-input"
            />
            <button onClick={handleSaveUrl} disabled={uploading} className="save-btn">
              {uploading ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : (
          <div className="file-upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="file-input"
            />
            <button onClick={handleUploadImage} disabled={uploading || !imageFile} className="save-btn">
              {uploading ? 'Uploading...' : 'Upload & Save'}
            </button>
          </div>
        )}

        <button onClick={handleCancel} disabled={uploading} className="cancel-btn">
          Cancel
        </button>

        {currentImageUrl && (
          <div className="current-image-preview">
            <p>Current image:</p>
            <img src={currentImageUrl} alt="Current" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`editable-image-wrapper ${editMode ? 'editable' : ''}`}>
      <img
        src={currentImageUrl}
        alt={alt}
        className={className}
        onClick={handleClick}
        title={editMode ? 'Click to change image' : ''}
      />
      {editMode && (
        <div className="edit-overlay">
          <span>✏️ Click to change image</span>
        </div>
      )}
    </div>
  );
};

export default EditableImage;

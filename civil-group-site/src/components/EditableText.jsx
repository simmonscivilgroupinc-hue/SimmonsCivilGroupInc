import { useState } from 'react';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import './EditableText.css';

const EditableText = ({ section, field, as = 'p', className = '', multiline = false, children }) => {
  const { content, editMode, updateContent } = useWebsiteContent();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const Component = as;

  // Get the actual value from content
  const getValue = () => {
    if (!content[section]) return children || '';

    if (field.includes('.')) {
      const parts = field.split('.');
      let value = content[section];
      for (const part of parts) {
        value = value?.[part];
      }
      return value || children || '';
    }

    return content[section][field] || children || '';
  };

  const currentValue = getValue();

  const handleClick = (e) => {
    if (editMode && !isEditing) {
      e.preventDefault();
      e.stopPropagation();
      setEditValue(currentValue);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateContent(section, field, editValue);
    setSaving(false);

    if (result.success) {
      setIsEditing(false);
    } else {
      alert('Failed to save: ' + result.error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="editable-text-editor">
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`editable-textarea ${className}`}
            rows={5}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`editable-input ${className}`}
            autoFocus
          />
        )}
        <div className="editable-actions">
          <button onClick={handleSave} disabled={saving} className="save-btn">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleCancel} disabled={saving} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <Component
      className={`${className} ${editMode ? 'editable-text' : ''}`}
      onClick={handleClick}
      title={editMode ? 'Click to edit' : ''}
    >
      {currentValue}
    </Component>
  );
};

export default EditableText;

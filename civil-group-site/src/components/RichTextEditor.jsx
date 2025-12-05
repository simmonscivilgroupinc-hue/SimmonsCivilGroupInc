import { useState, useRef } from 'react';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, onSave, onCancel, saving }) => {
  const editorRef = useRef(null);
  const [isPreview, setIsPreview] = useState(false);

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || '';
    onChange(html);
  };

  const convertTextToHtml = (text) => {
    if (!text) return '';
    // If already contains HTML tags, return as is
    if (text.includes('<')) return text;
    // Convert plain text line breaks to HTML
    return text.replace(/\n/g, '<br>');
  };

  const getPlainText = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  return (
    <div className="rich-text-editor">
      <div className="rte-toolbar">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="rte-btn"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="rte-btn"
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          className="rte-btn"
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <div className="rte-separator"></div>
        <button
          type="button"
          onClick={() => applyFormat('insertUnorderedList')}
          className="rte-btn"
          title="Bullet List"
        >
          ⦿
        </button>
        <button
          type="button"
          onClick={() => applyFormat('insertOrderedList')}
          className="rte-btn"
          title="Numbered List"
        >
          ≡
        </button>
        <div className="rte-separator"></div>
        <button
          type="button"
          onClick={() => applyFormat('formatBlock', 'h1')}
          className="rte-btn"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => applyFormat('formatBlock', 'h2')}
          className="rte-btn"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => applyFormat('formatBlock', 'h3')}
          className="rte-btn"
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => applyFormat('formatBlock', 'p')}
          className="rte-btn"
          title="Paragraph"
        >
          P
        </button>
        <div className="rte-separator"></div>
        <button
          type="button"
          onClick={() => applyFormat('removeFormat')}
          className="rte-btn"
          title="Clear Formatting"
        >
          ✕
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`rte-btn ${isPreview ? 'active' : ''}`}
          title="Toggle Preview"
        >
          👁
        </button>
      </div>

      {isPreview ? (
        <div className="rte-preview" dangerouslySetInnerHTML={{ __html: value }} />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          className="rte-content"
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: convertTextToHtml(value) }}
          suppressContentEditableWarning
        />
      )}

      <div className="rte-actions">
        <button onClick={onSave} disabled={saving} className="save-btn">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onCancel} disabled={saving} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RichTextEditor;

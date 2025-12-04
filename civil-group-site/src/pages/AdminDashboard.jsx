import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { hasPendingChanges, publishChanges, discardChanges, isSaving } = useWebsiteContent();
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const contactsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContacts(contactsData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId, newStatus) => {
    try {
      await updateDoc(doc(db, 'contacts', contactId), { status: newStatus });
      setContacts(contacts.map(contact =>
        contact.id === contactId ? { ...contact, status: newStatus } : contact
      ));
      showMessage('success', 'Contact status updated');
    } catch (error) {
      console.error('Error updating contact:', error);
      showMessage('error', 'Failed to update contact status');
    }
  };

  const deleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      await deleteDoc(doc(db, 'contacts', contactId));
      setContacts(contacts.filter(contact => contact.id !== contactId));
      showMessage('success', 'Contact deleted');
    } catch (error) {
      console.error('Error deleting contact:', error);
      showMessage('error', 'Failed to delete contact');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePublish = async () => {
    if (!window.confirm('Publish all pending changes to the live site? This will deploy your changes in about 30 seconds.')) {
      return;
    }

    setIsPublishing(true);
    const result = await publishChanges();
    setIsPublishing(false);

    if (result.success) {
      showMessage('success', 'Changes published successfully! Your site will update in ~30 seconds.');
    } else {
      showMessage('error', result.error || 'Failed to publish changes');
    }
  };

  const handleDiscard = async () => {
    if (!window.confirm('Discard all pending changes? This cannot be undone.')) {
      return;
    }

    await discardChanges();
    showMessage('success', 'All pending changes discarded');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="modern-admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="header-subtitle">Manage your website content and inquiries</p>
        </div>
        <div className="header-actions">
          {hasPendingChanges && (
            <div className="pending-changes-banner">
              <span className="pending-indicator">●</span>
              <span>You have unpublished changes</span>
            </div>
          )}
          <div className="header-buttons">
            {hasPendingChanges && (
              <>
                <button
                  onClick={handleDiscard}
                  className="discard-btn"
                  disabled={isPublishing || isSaving}
                >
                  Discard Changes
                </button>
                <button
                  onClick={handlePublish}
                  className="publish-btn"
                  disabled={isPublishing || isSaving}
                >
                  {isPublishing ? 'Publishing...' : 'Publish to Live Site'}
                </button>
              </>
            )}
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{contacts.filter(c => c.status === 'new').length}</span>
              <span className="stat-label">New</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{contacts.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No contacts yet</h2>
          <p>When visitors submit the contact form, they'll appear here.</p>
        </div>
      ) : (
        <div className="contacts-table-container">
          <table className="modern-contacts-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} className={`status-${contact.status || 'new'}`}>
                  <td data-label="Date">
                    <span className="date-text">{formatDate(contact.createdAt)}</span>
                  </td>
                  <td data-label="Name">
                    <strong>{contact.name}</strong>
                  </td>
                  <td data-label="Email">
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </td>
                  <td data-label="Phone">
                    {contact.phone ? (
                      <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                  <td data-label="Message" className="message-cell">
                    <div className="message-preview">{contact.message}</div>
                  </td>
                  <td data-label="Status">
                    <select
                      value={contact.status || 'new'}
                      onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                      className={`status-select status-${contact.status || 'new'}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td data-label="Actions">
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="delete-btn"
                      title="Delete contact"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import EditableText from './EditableText';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  const { content, editMode, toggleEditMode } = useWebsiteContent();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo-wrapper">
          {!editMode && (
            <Link to="/" className="navbar-logo">
              {content.navbar.companyName}
            </Link>
          )}
          {editMode && isHomePage && (
            <div className="navbar-logo-editable">
              <EditableText section="navbar" field="companyName" as="span">
                {content.navbar.companyName}
              </EditableText>
            </div>
          )}
          {editMode && !isHomePage && (
            <Link to="/" className="navbar-logo">
              {content.navbar.companyName}
            </Link>
          )}
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><button onClick={() => scrollToSection('home')}>Home</button></li>
          <li><button onClick={() => scrollToSection('about')}>About</button></li>
          <li><button onClick={() => scrollToSection('services')}>Services</button></li>
          <li><button onClick={() => scrollToSection('gallery')}>Gallery</button></li>
          <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
          {isAdmin && (
            <>
              {isHomePage && (
                <li>
                  <button
                    onClick={toggleEditMode}
                    className={`edit-mode-btn ${editMode ? 'active' : ''}`}
                  >
                    {editMode ? '✅ Edit Mode ON' : '✏️ Edit Mode'}
                  </button>
                </li>
              )}
              <li><Link to="/admin">Dashboard</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>

        <div className="phone-wrapper">
          {!editMode && (
            <a href={`tel:${content.navbar.phone.replace(/\D/g, '')}`} className="phone-number">
              {content.navbar.phone}
            </a>
          )}
          {editMode && isHomePage && (
            <div className="phone-editable">
              <EditableText section="navbar" field="phone" as="span">
                {content.navbar.phone}
              </EditableText>
            </div>
          )}
          {editMode && !isHomePage && (
            <a href={`tel:${content.navbar.phone.replace(/\D/g, '')}`} className="phone-number">
              {content.navbar.phone}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

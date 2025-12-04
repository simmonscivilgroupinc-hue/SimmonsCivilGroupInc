import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import { motion } from 'framer-motion';
import './ModernNavbar.css';

const ModernNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  const { content, editMode, toggleEditMode } = useWebsiteContent();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.includes('/admin') || location.pathname.includes('/login');

  // Admin Navigation
  if (isAdmin && isAdminPage) {
    return (
      <motion.nav
        className="modern-navbar admin-navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <img src="/logos/SimmonsCivilLogo.png" alt="Company Logo" className="brand-logo" />
            <span className="brand-text">{content.navbar.companyName}</span>
          </Link>

          <div className="admin-nav-items">
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
              <span className="nav-icon">📊</span> Dashboard
            </Link>
            <Link to="/" className="home-link">
              <span className="nav-icon">🏠</span> View Site
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <span className="nav-icon">🚪</span> Logout
            </button>
          </div>
        </div>
      </motion.nav>
    );
  }

  // Public Navigation
  return (
    <motion.nav
      className="modern-navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <motion.img
            src="/logos/SimmonsCivilLogo.png"
            alt="Company Logo"
            className="brand-logo"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <span className="brand-text">{content.navbar.companyName}</span>
        </Link>

        <button
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <button onClick={() => scrollToSection('home')} className="nav-link">
            Home
          </button>
          <button onClick={() => scrollToSection('about')} className="nav-link">
            About
          </button>
          <button onClick={() => scrollToSection('services')} className="nav-link">
            Services
          </button>
          <button onClick={() => scrollToSection('gallery')} className="nav-link">
            Gallery
          </button>
          <button onClick={() => scrollToSection('contact')} className="nav-link">
            Contact
          </button>

          {isAdmin && isHomePage && (
            <button
              onClick={toggleEditMode}
              className={`edit-mode-toggle ${editMode ? 'active' : ''}`}
            >
              {editMode ? '✅ Edit Mode' : '✏️ Edit'}
            </button>
          )}

          {isAdmin && (
            <Link to="/admin" className="admin-link">
              Dashboard
            </Link>
          )}

          <a href={`tel:${content.navbar.phone.replace(/\D/g, '')}`} className="phone-btn">
            📞 {content.navbar.phone}
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default ModernNavbar;

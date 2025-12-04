import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import { motion } from 'framer-motion';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';
import EditableBackgroundImage from '../components/EditableBackgroundImage';
import ModernGallery from '../components/ModernGallery';
import './ModernHome.css';

const ModernHome = () => {
  const { content } = useWebsiteContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const observers = [];
    const sections = ['about', 'services', 'contact'];

    sections.forEach(sectionId => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
          }
        },
        { threshold: 0.1 }
      );

      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new'
      });

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! We\'ll get back to you soon.'
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modern-home">
      {/* Hero Section */}
      <EditableBackgroundImage
        section="hero"
        field="backgroundImage"
        className="modern-hero"
      >
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <EditableText section="hero" field="title" as="h1" className="hero-title">
              {content.hero.title}
            </EditableText>
            <EditableText section="hero" field="subtitle" as="p" className="hero-subtitle">
              {content.hero.subtitle}
            </EditableText>
            <motion.button
              className="hero-cta"
              onClick={() => {
                const contact = document.getElementById('contact');
                contact?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started →
            </motion.button>
          </motion.div>
        </div>
        <div className="hero-overlay"></div>
      </EditableBackgroundImage>

      {/* About Section */}
      <section id="about" className="modern-about">
        <div className="container">
          <motion.div
            className="about-grid"
            initial={{ opacity: 0 }}
            animate={visibleSections.about ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="about-content"
              initial={{ opacity: 0, x: -50 }}
              animate={visibleSections.about ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="section-tag">WHO WE ARE</div>
              <EditableText section="about" field="title" as="h2" className="section-title">
                {content.about.title}
              </EditableText>
              <EditableText section="about" field="subtitle" as="h3" className="about-subtitle">
                {content.about.subtitle}
              </EditableText>
              <EditableText section="about" field="text1" as="p" multiline className="about-text">
                {content.about.text1}
              </EditableText>
              <EditableText section="about" field="text2" as="p" multiline className="about-text">
                {content.about.text2}
              </EditableText>
            </motion.div>

            <motion.div
              className="about-image-wrapper"
              initial={{ opacity: 0, x: 50 }}
              animate={visibleSections.about ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="image-decoration"></div>
              <EditableImage
                section="about"
                field="image"
                alt="About Us"
                className="about-image"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="modern-services">
        <div className="container">
          <motion.div
            className="services-header"
            initial={{ opacity: 0, y: 50 }}
            animate={visibleSections.services ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-tag">WHAT WE DO</div>
            <EditableText section="services" field="title" as="h2" className="section-title">
              {content.services.title}
            </EditableText>
          </motion.div>

          <div className="services-grid">
            {content.services.items.map((service, index) => (
              <motion.div
                key={service.id}
                className="service-card"
                initial={{ opacity: 0, y: 50 }}
                animate={visibleSections.services ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="service-number">{String(index + 1).padStart(2, '0')}</div>
                <EditableText
                  section="services"
                  field={`items.${index}.title`}
                  as="h3"
                  className="service-title"
                >
                  {service.title}
                </EditableText>
                <EditableText
                  section="services"
                  field={`items.${index}.description`}
                  as="p"
                  multiline
                  className="service-description"
                >
                  {service.description}
                </EditableText>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <ModernGallery />

      {/* Contact Section */}
      <section id="contact" className="modern-contact">
        <div className="container">
          <motion.div
            className="contact-grid"
            initial={{ opacity: 0 }}
            animate={visibleSections.contact ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="contact-info-side"
              initial={{ opacity: 0, x: -50 }}
              animate={visibleSections.contact ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="section-tag">GET IN TOUCH</div>
              <EditableText section="contact" field="title" as="h2" className="section-title">
                {content.contact.title}
              </EditableText>
              <EditableText section="contact" field="subtitle" as="h3" className="contact-subtitle">
                {content.contact.subtitle}
              </EditableText>

              <div className="contact-details">
                <div className="detail-item">
                  <div className="detail-icon">📍</div>
                  <div className="detail-content">
                    <h4>Address</h4>
                    <EditableText section="contact" field="address" as="p" multiline>
                      {content.contact.address}
                    </EditableText>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">📞</div>
                  <div className="detail-content">
                    <h4>Phone</h4>
                    <EditableText section="contact" field="phone" as="p">
                      {content.contact.phone}
                    </EditableText>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">🕐</div>
                  <div className="detail-content">
                    <h4>Hours</h4>
                    <EditableText section="contact" field="hours" as="p">
                      {content.contact.hours}
                    </EditableText>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="contact-form-side"
              initial={{ opacity: 0, x: 50 }}
              animate={visibleSections.contact ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="modern-contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name *"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email *"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone"
                  />
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message *"
                    rows="5"
                    required
                  ></textarea>
                </div>

                {submitStatus.message && (
                  <motion.div
                    className={`status-message ${submitStatus.type}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message →'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ModernHome;

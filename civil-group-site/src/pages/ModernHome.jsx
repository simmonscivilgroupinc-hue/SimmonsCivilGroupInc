import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaucetDrip, faDroplet, faCloudShowersHeavy, faHelmetSafety } from '@fortawesome/free-solid-svg-icons';
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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        { threshold: 0.3 }
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
        style={{
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      >
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.2,
              type: "spring",
              stiffness: 100
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <EditableText section="hero" field="title" as="h1" className="hero-title">
                {content.hero.title}
              </EditableText>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <EditableText section="hero" field="subtitle" as="p" className="hero-subtitle">
                {content.hero.subtitle}
              </EditableText>
            </motion.div>
            <motion.button
              className="hero-cta"
              onClick={() => {
                const contact = document.getElementById('contact');
                contact?.scrollIntoView({ behavior: 'smooth' });
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4)"
              }}
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
          <motion.div className="about-grid">
            <motion.div
              className="about-content"
              initial={{ opacity: 0, x: -100 }}
              animate={visibleSections.about ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 1,
                type: "spring",
                stiffness: 80
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={visibleSections.about ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="section-tag">WHO WE ARE</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.about ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <EditableText section="about" field="title" as="h2" className="section-title">
                  {content.about.title}
                </EditableText>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.about ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <EditableText section="about" field="subtitle" as="h3" className="about-subtitle">
                  {content.about.subtitle}
                </EditableText>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.about ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <EditableText section="about" field="text1" as="p" multiline className="about-text">
                  {content.about.text1}
                </EditableText>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.about ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <EditableText section="about" field="text2" as="p" multiline className="about-text">
                  {content.about.text2}
                </EditableText>
              </motion.div>
            </motion.div>

            <motion.div
              className="about-image-wrapper"
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              animate={visibleSections.about ? { opacity: 1, x: 0, rotate: 0 } : {}}
              transition={{
                duration: 1,
                delay: 0.3,
                type: "spring",
                stiffness: 80
              }}
            >
              <motion.div
                className="image-decoration"
                initial={{ scale: 0, rotate: -45 }}
                animate={visibleSections.about ? { scale: 1, rotate: 0 } : {}}
                transition={{ duration: 1, delay: 0.5, type: "spring" }}
              ></motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.4 }}
              >
                <EditableImage
                  section="about"
                  field="image"
                  alt="About Us"
                  className="about-image"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="modern-services">
        <div className="container">
          <motion.div
            className="services-header"
            initial={{ opacity: 0, y: 60 }}
            animate={visibleSections.services ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={visibleSections.services ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="section-tag">WHAT WE DO</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={visibleSections.services ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <EditableText section="services" field="title" as="h2" className="section-title">
                {content.services.title}
              </EditableText>
            </motion.div>
          </motion.div>

          <div className="services-grid">
            {content.services.items.map((service, index) => {
              // Icon mapping for each service - Sewer (pipe/faucet), Water (droplet), Storm (heavy rain), Grading (safety helmet/construction)
              const serviceIcons = [faFaucetDrip, faDroplet, faCloudShowersHeavy, faHelmetSafety];

              return (
              <motion.div
                key={service.id}
                className="service-card"
                initial={{ opacity: 0, y: 80, scale: 0.9 }}
                animate={visibleSections.services ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  y: -15,
                  scale: 1.03,
                  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.2)",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  className="service-icon"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={visibleSections.services ? { scale: 1, rotate: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1, type: "spring" }}
                >
                  <FontAwesomeIcon icon={serviceIcons[index]} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={visibleSections.services ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <EditableText
                    section="services"
                    field={`items.${index}.title`}
                    as="h3"
                    className="service-title"
                  >
                    {service.title}
                  </EditableText>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={visibleSections.services ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
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
                <motion.div
                  className="service-hover-effect"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <ModernGallery />

      {/* Contact Section */}
      <section id="contact" className="modern-contact">
        <div className="container">
          <motion.div className="contact-grid">
            <motion.div
              className="contact-info-side"
              initial={{ opacity: 0, x: -100 }}
              animate={visibleSections.contact ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, type: "spring", stiffness: 80 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={visibleSections.contact ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="section-tag">GET IN TOUCH</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.contact ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <EditableText section="contact" field="title" as="h2" className="section-title">
                  {content.contact.title}
                </EditableText>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.contact ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <EditableText section="contact" field="subtitle" as="h3" className="contact-subtitle">
                  {content.contact.subtitle}
                </EditableText>
              </motion.div>

              <div className="contact-details">
                {[
                  { icon: '📍', title: 'Address', field: 'address' },
                  { icon: '📞', title: 'Phone', field: 'phone' },
                  { icon: '🕐', title: 'Hours', field: 'hours' }
                ].map((detail, index) => (
                  <motion.div
                    key={detail.field}
                    className="detail-item"
                    initial={{ opacity: 0, x: -50 }}
                    animate={visibleSections.contact ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    whileHover={{
                      x: 10,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <motion.div
                      className="detail-icon"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {detail.icon}
                    </motion.div>
                    <div className="detail-content">
                      <h4>{detail.title}</h4>
                      <EditableText section="contact" field={detail.field} as="p" multiline={detail.field === 'address'}>
                        {content.contact[detail.field]}
                      </EditableText>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="contact-form-side"
              initial={{ opacity: 0, x: 100 }}
              animate={visibleSections.contact ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 80 }}
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

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';
import EditableBackgroundImage from '../components/EditableBackgroundImage';
import Gallery from '../components/Gallery';
import './Home.css';

const Home = () => {
  const { content, editMode } = useWebsiteContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        message: 'Thank you for contacting us! We will get back to you soon.'
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit form. Please try again.'
      });
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <EditableBackgroundImage
        section="hero"
        field="backgroundImage"
        className="hero"
      >
        <div className="hero-overlay">
          <EditableText section="hero" field="title" as="h1">
            {content.hero.title}
          </EditableText>
          <EditableText section="hero" field="subtitle" as="p">
            {content.hero.subtitle}
          </EditableText>
        </div>
      </EditableBackgroundImage>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <EditableText section="about" field="title" as="h2">
            {content.about.title}
          </EditableText>
          <div className="about-content">
            <div className="about-text">
              <EditableText section="about" field="subtitle" as="h3">
                {content.about.subtitle}
              </EditableText>
              <EditableText section="about" field="text1" as="p" multiline>
                {content.about.text1}
              </EditableText>
              <EditableText section="about" field="text2" as="p" multiline>
                {content.about.text2}
              </EditableText>
            </div>
            <div className="about-image">
              <EditableImage
                section="about"
                field="image"
                alt="Construction Site"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <EditableText section="services" field="title" as="h2">
            {content.services.title}
          </EditableText>
          <div className="services-grid">
            {content.services.items.map((service, index) => (
              <div key={service.id} className="service-card">
                <EditableText
                  section="services"
                  field={`items.${index}.title`}
                  as="h3"
                >
                  {service.title}
                </EditableText>
                <EditableText
                  section="services"
                  field={`items.${index}.description`}
                  as="p"
                  multiline
                >
                  {service.description}
                </EditableText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <Gallery />

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <EditableText section="contact" field="title" as="h2">
            {content.contact.title}
          </EditableText>
          <div className="contact-content">
            <div className="contact-info">
              <EditableText section="contact" field="subtitle" as="h3">
                {content.contact.subtitle}
              </EditableText>
              <p>
                <strong>Address:</strong>
                <br />
                <EditableText section="contact" field="address" as="span" multiline>
                  {content.contact.address}
                </EditableText>
              </p>
              <p>
                <strong>Phone:</strong>
                <br />
                <EditableText section="contact" field="phone" as="span">
                  {content.contact.phone}
                </EditableText>
              </p>
              <p>
                <strong>Hours:</strong>
                <br />
                <EditableText section="contact" field="hours" as="span">
                  {content.contact.hours}
                </EditableText>
              </p>
            </div>
            <div className="contact-form-wrapper">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                {submitStatus.message && (
                  <div className={`status-message ${submitStatus.type}`}>
                    {submitStatus.message}
                  </div>
                )}
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

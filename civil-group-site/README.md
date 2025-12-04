# Simmons Civil Group Inc - Company Website

A modern, responsive company website with contact form and admin dashboard for managing submissions and images.

## Features

- **Landing Page** with hero section, about, services, and contact form
- **Contact Form** that saves submissions to Firebase Firestore
- **Admin Dashboard** at `/login` for viewing contact submissions
- **Image Management** with ImgBB integration for easy photo updates
- **Responsive Design** that works on all devices

## Tech Stack

- React 19 with Vite
- Firebase (Firestore for database, Authentication for admin login)
- React Router for navigation
- ImgBB API for image hosting

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd civil-group-site
npm install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database**
4. Enable **Authentication** > Email/Password
5. Get your Firebase config from Project Settings
6. Create your admin user in Authentication with the email you want to use

### 3. Set Up ImgBB

1. Go to [ImgBB API](https://api.imgbb.com/)
2. Sign up for a free account
3. Get your API key from the dashboard

### 4. Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_ADMIN_EMAIL=admin@example.com
```

**Important:** Set `VITE_ADMIN_EMAIL` to the email address you created in Firebase Authentication. Only this email will have admin access.

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### For Visitors

- Browse the homepage to see company information and services
- Fill out the contact form to send inquiries
- All submissions are saved to Firebase

### For Admins

1. Navigate to `/login`
2. Log in with your admin email and password
3. View all contact submissions in the "Contact Submissions" tab
4. Mark submissions as "New", "Contacted", or "Resolved"
5. Delete old submissions if needed

### Managing Images

1. Log in to the admin dashboard
2. Go to the "Image Management" tab
3. Upload new images with descriptive labels
4. Copy the image URLs to use in your website
5. Delete images when no longer needed

**Note:** To use uploaded images in the landing page, update the image URLs in `src/pages/Home.jsx`

## Firebase Firestore Collections

The app uses two collections:

- `contacts`: Stores contact form submissions
  - Fields: name, email, phone, message, status, createdAt
- `images`: Stores uploaded image URLs and metadata
  - Fields: url, label, createdAt

## Building for Production

```bash
npm run build
```

The build files will be in the `dist` directory. Deploy this folder to your hosting service (Netlify, Vercel, Firebase Hosting, etc.)

## Customization

### Updating Company Information

Edit `src/pages/Home.jsx` to update:
- Company name and tagline
- About section text
- Services list
- Contact information (address, phone, hours)

### Changing Colors

Edit the CSS files to match your brand:
- `src/components/Navbar.css` - Navigation bar colors
- `src/pages/Home.css` - Landing page colors
- Primary color: `rgb(40, 56, 120)` (blue)
- Dark color: `rgb(22, 22, 22)` (header background)

### Adding More Images

1. Upload images via the admin dashboard
2. Copy the image URL
3. Update the `src` attributes in `src/pages/Home.jsx`

## License

Private project for Simmons Civil Group Inc

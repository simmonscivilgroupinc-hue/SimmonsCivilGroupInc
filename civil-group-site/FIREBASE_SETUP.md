# Firebase Setup Instructions

## Step 1: Update Firestore Security Rules

1. Go to your Firebase Console: https://console.firebase.google.com/project/simmonscivilgroupinc-92902/firestore/databases/-default-/rules

2. Replace the existing rules with the content from `firestore.rules` file in this project:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Contacts collection - allow public writes (for contact form)
    // Only authenticated users can read (admins)
    match /contacts/{contactId} {
      allow read: if request.auth != null;
      allow create: if true;  // Anyone can submit contact form
      allow update, delete: if request.auth != null;
    }

    // Images collection - allow public reads (for website display)
    // Only authenticated users can write (admins)
    match /images/{imageId} {
      allow read: if true;  // Anyone can view images
      allow write: if request.auth != null;  // Only admins can manage images
    }

    // Site content collection - allow public reads (for website display)
    // Only authenticated users can write (admins)
    match /siteContent/{docId} {
      allow read: if true;  // Anyone can view site content
      allow write: if request.auth != null;  // Only admins can edit content
    }
  }
}
```

3. Click "Publish" to save the rules

## Step 2: Create Admin User

1. Go to Firebase Authentication: https://console.firebase.google.com/project/simmonscivilgroupinc-92902/authentication/users

2. Click "Add user"

3. Enter your email address: `simmonscivilgroupinc@gmail.com` (already set in .env)

4. Enter a strong password

5. Click "Add user"

## Step 3: Start the Development Server

```bash
npm run dev
```

## Step 4: Test the Application

1. Visit http://localhost:5173
2. Test the contact form on the homepage
3. Go to http://localhost:5173/login
4. Log in with `simmonscivilgroupinc@gmail.com` and your password

## Step 5: Using Edit Mode

### How to Edit Website Content

1. **Log in as admin** at http://localhost:5173/login

2. **Go to the homepage** - You'll see an "✏️ Edit Mode" button in the navigation bar

3. **Click "Edit Mode"** - The button will turn green and show "✅ Edit Mode ON"

4. **Click on any text or image** to edit it:
   - **Text**: Click on any text element (headings, paragraphs, etc.) to edit inline
   - **Images**: Click on any image to upload a new one or enter a new URL
   - Changes save automatically to Firebase

5. **Turn off Edit Mode** when done by clicking the button again

### What You Can Edit:

- **Navbar**: Company name and phone number
- **Hero Section**: Main title, subtitle, and background image
- **About Section**: All text and image
- **Services**: All service titles and descriptions
- **Contact Info**: Address, phone, and hours

### Admin Dashboard Features:

- **Contact Submissions Tab**: View and manage all contact form submissions
  - Mark as New/Contacted/Resolved
  - Delete old submissions

- **Image Management Tab**: Upload images to ImgBB
  - Upload images that can be used throughout the site
  - Copy URLs to use in content
  - Delete unused images

## Security Notes

- Only the email specified in `VITE_ADMIN_EMAIL` can access the admin dashboard and edit mode
- Contact form submissions are public (anyone can submit)
- All website content is publicly readable (so visitors can see the website)
- Only authenticated admins can:
  - Edit website content
  - Manage images
  - View and manage contact submissions

## Troubleshooting

- **Edit mode not showing**: Make sure you're logged in as admin and on the homepage
- **Changes not saving**: Check browser console for errors and ensure Firestore rules are published
- **Images not uploading**: Verify ImgBB API key is correct in .env file

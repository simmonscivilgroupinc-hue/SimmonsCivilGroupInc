# Simmons Civil Group Inc - Complete Setup Guide

## 🎉 What's New - Full CMS Features!

Your website is now a **complete Content Management System** where admins can edit everything without touching code!

### New Features:
- ✅ **Click-to-edit** text on any page element
- ✅ **Click-to-change** images including hero background
- ✅ **Photo Gallery** with add/remove/edit capabilities
- ✅ **Modern design** with professional stock images
- ✅ **Contact form** saving to Firebase
- ✅ **Admin dashboard** for managing everything
- ✅ **Improved navigation** that works from any page

---

## 🚨 IMPORTANT: Update Firestore Rules First!

**Before testing, you MUST update your Firestore rules in Firebase Console:**

1. Go to: https://console.firebase.google.com/project/simmonscivilgroupinc-92902/firestore/databases/-default-/rules

2. Copy ALL the rules from the `firestore.rules` file in your project

3. **Click "Publish"** - This is critical!

If you skip this step, you'll get "Missing or insufficient permissions" errors.

---

## 📝 Quick Start

### 1. Make sure your admin user exists in Firebase Authentication
- Email: `simmonscivilgroupinc@gmail.com` (already in .env)
- If not created yet, add it in Firebase Console Authentication

### 2. Start the development server
```bash
cd civil-group-site
npm run dev
```

### 3. Log in and test
- Visit: http://localhost:5173/login
- Log in with your admin credentials
- You'll be redirected to the homepage

---

## 🎨 How to Use Edit Mode

### Turning On Edit Mode
1. **Log in** as admin
2. **Go to the homepage** - You'll see "✏️ Edit Mode" in the navbar
3. **Click "Edit Mode"** - Button turns green showing "✅ Edit Mode ON"
4. Now you can click on ANY text or image to edit it!

### Editing Text
- **Click on any text** (headings, paragraphs, etc.)
- Edit in the input/textarea that appears
- Press **Enter** to save (or click Save button)
- Press **Escape** to cancel

### Editing Images
- **Click on any image**
- Choose to:
  - **Paste a URL** from an existing image online
  - **Upload a new image** from your computer (uploads to ImgBB)
- Changes save automatically

### Editing Hero Background
- **Look for the "🖼️ Change Background Image" button** in the top right of the hero section
- Click it when Edit Mode is ON
- Upload or enter URL for new background image

---

## 📸 Managing the Photo Gallery

### Adding Photos
1. Turn on Edit Mode
2. Scroll to the Gallery section
3. Click **"+ Add Image to Gallery"**
4. Choose to upload or paste URL
5. Add a caption
6. Click "Add Image"

### Editing Captions
1. In Edit Mode, each gallery image shows action buttons
2. Click **"Edit Caption"** on any image
3. Update the caption
4. Click "Save"

### Deleting Photos
1. In Edit Mode, click **"Delete"** on any gallery image
2. Confirm deletion

### Viewing Photos
- Click any gallery image (even when not in Edit Mode)
- View full-size in lightbox
- Click anywhere to close

---

## 🎯 What You Can Edit

### Navbar
- Company name (top left)
- Phone number (top right)

### Hero Section
- Main title
- Subtitle
- Background image

### About Section
- Section title
- Subtitle
- Both text paragraphs
- Side image

### Services
- Section title
- Each service title
- Each service description

### Gallery
- Section title
- Subtitle
- Add/remove/edit photos
- Photo captions

### Contact Info
- Section title
- Subtitle ("Get In Touch")
- Address
- Phone number
- Hours

---

## 🔧 Admin Dashboard Features

Access at: http://localhost:5173/admin (or /login if not logged in)

### Contact Submissions Tab
- View all form submissions
- Mark as New/Contacted/Resolved
- Delete old submissions
- Sort by date (newest first)

### Image Management Tab
- Upload images to ImgBB
- Copy URLs to use anywhere
- Delete unused images
- View all uploaded images

---

## 🎨 Design Improvements

### Modern Stock Images
- All default images are high-quality Unsplash photos
- Relevant construction/civil engineering themes
- Professional appearance

### Better Layout
- Improved navbar spacing
- Better mobile responsive design
- Smoother navigation
- Modern color scheme

### Gallery Section
- Professional grid layout
- Hover effects
- Lightbox for viewing
- Mobile-friendly

---

## 🔒 Security

- Only `simmonscivilgroupinc@gmail.com` can access Edit Mode and Admin Dashboard
- Contact form submissions are public (anyone can submit)
- All website content is publicly readable
- Only authenticated admins can:
  - Edit website content
  - Manage gallery
  - View contact submissions
  - Upload images

---

## 🐛 Troubleshooting

### "Missing or insufficient permissions" error
- **Update Firestore rules** in Firebase Console (see step at top)
- Make sure you clicked "Publish" after pasting rules

### Edit mode not showing
- Make sure you're logged in as admin
- Make sure you're on the homepage (/)
- Check that your email matches `VITE_ADMIN_EMAIL` in .env

### Can't click company name to go home
- This is intentional when in Edit Mode on homepage (so you can edit it)
- Turn off Edit Mode first, or click Home button in nav menu

### Images not uploading
- Check that `VITE_IMGBB_API_KEY` is correct in .env
- Make sure image is under 32MB

### Changes not saving
- Check browser console (F12) for errors
- Verify Firestore rules are published
- Make sure you're logged in

---

## 📱 Testing Checklist

- [ ] Log in at /login
- [ ] Toggle Edit Mode on homepage
- [ ] Edit some text (try headlines and paragraphs)
- [ ] Change an image
- [ ] Change hero background
- [ ] Add a photo to gallery
- [ ] Edit a gallery caption
- [ ] Delete a gallery photo
- [ ] View a photo in lightbox
- [ ] Submit contact form (test as visitor - log out first)
- [ ] View contact submission in admin dashboard
- [ ] Upload image in admin dashboard
- [ ] Test on mobile (resize browser or use phone)

---

## 🚀 Next Steps

### Going Live
1. Update all placeholder content (address, hours, etc.)
2. Upload real project photos to gallery
3. Update services to match actual offerings
4. Test everything thoroughly
5. Build for production: `npm run build`
6. Deploy `dist` folder to your hosting (Netlify, Vercel, Firebase Hosting, etc.)

### Ongoing Management
- Log in regularly to check contact form submissions
- Update gallery with new projects
- Keep content fresh and up-to-date
- All changes are instant - no redeployment needed!

---

## 📞 Support

If you need help:
- Check browser console (F12) for errors
- Review this guide
- Check Firebase Console for connection issues
- Verify .env file has all correct keys

---

## ✨ Pro Tips

1. **Take screenshots before major changes** - you can always revert by re-entering previous values
2. **Test uploads with small images first** - faster to upload and test
3. **Use high-quality images** - They make your site look more professional
4. **Keep captions concise** - They show up in gallery and lightbox
5. **Regularly check contact form** - Don't miss potential clients!

Your website is now a fully functional CMS! Enjoy managing your content with ease! 🎉

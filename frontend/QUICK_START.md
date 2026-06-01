# 🚀 GlassVision - Quick Start Guide

## Prerequisites
- Node.js (v18+)
- MongoDB running locally or connection string set
- npm or yarn

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB (if local)
```bash
# Windows
mongod

# macOS/Linux
mongod
```

### 3. Start Backend Server
```bash
node server.js
```

Expected output:
```
✅ MongoDB connected
👑 Default admin user created: admin@glassvision.com / admin123
🚀 Server running on port 5000
```

### 4. Start Frontend Development Server (in another terminal)
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## 🔐 Login Credentials

### User Account
- Email: `user@example.com` (any email for registration)
- Password: (set during registration)

### Admin Account (Default)
- Email: `admin@glassvision.com`
- Password: `admin123`

---

## 📍 Key URLs

| Page | URL | Description |
|------|-----|-------------|
| Homepage | http://localhost:3000 | Main landing page |
| User Login | http://localhost:3000/login | User authentication |
| Admin Login | http://localhost:3000/admin/login | Admin authentication |
| Customize Door | http://localhost:3000/customize | 3D door customizer with AR |
| Admin Dashboard | http://localhost:3000/admin | Admin dashboard (protected) |
| Catalog | http://localhost:3000/catalog | Product catalog |
| Checkout | http://localhost:3000/checkout | Checkout page |

---

## 🧪 Testing the Fixed Features

### ✅ Test User Login
1. Navigate to `/login`
2. Enter email and password
3. Should redirect to homepage after successful login
4. Check localStorage for `token` and `user`

### ✅ Test Admin Login
1. Navigate to `/admin/login`
2. Use: `admin@glassvision.com` / `admin123`
3. Should redirect to `/admin/dashboard`
4. Check localStorage for `adminToken`
5. Should see admin navigation with Dashboard, Products, Customers links

### ✅ Test AR View
1. Navigate to `/customize`
2. Click "AR Camera" tab
3. Should see AR interface with "Launch AR View" button
4. Button will show AR camera info (works better on mobile)

### ✅ Test 3D Model
1. Navigate to `/customize`
2. Click "3D Model" tab
3. Should see interactive 3D door model
4. Drag to rotate, scroll to zoom

---

## 🛠️ Build for Production

```bash
npm run build
npm start
```

---

## 📊 Project Structure

```
app/
  ├── login/           # User login page ✅ Fixed
  ├── admin/
  │   ├── login/      # Admin login page ✅ Fixed
  │   └── dashboard/  # Protected admin page
  └── customize/       # 3D customizer with AR ✅ Enhanced

components/
  ├── door-model-3d.tsx           # 3D viewer ✅ Working
  ├── preview-section.tsx         # AR view ✅ Enhanced
  ├── auth-provider.tsx           # Auth context ✅ Fixed
  └── door-configurator.ts        # Types ✅ Created

lib/
  ├── mongodb.ts                  # DB connection ✅ Fixed
  └── api.ts                      # API utilities ✅ Created

models/
  └── User.js                     # User schema ✅ Created

utils/
  └── api.ts                      # API client ✅ Enhanced
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/lib/api'"
**Solution**: Already fixed in this update. Run `npm install` again if needed.

### Issue: MongoDB connection failed
**Solution**: 
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env.local`
- Default: `mongodb://127.0.0.1:27017/glassvision`

### Issue: Admin login not working
**Solution**:
- Backend must be running on port 5000
- Check browser console for errors
- Verify `NEXT_PUBLIC_API_BASE=http://localhost:5000` in `.env.local`

### Issue: 3D model not rendering
**Solution**:
- Ensure Three.js packages are installed
- Check browser console for WebGL errors
- Try in a modern browser (Chrome, Firefox, Safari)

### Issue: AR view not launching
**Solution**:
- Currently displays information UI
- Full WebXR AR support requires mobile device with camera
- Can be enhanced with model-viewer library (already in package.json)

---

## 📚 Additional Commands

```bash
# Development build
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Backend server only
node server.js

# Backend server with dev
npm run dev:server
```

---

## 🎯 Next Steps

1. ✅ All errors fixed
2. ✅ User login working
3. ✅ Admin login working  
4. ✅ AR view enhanced
5. ✅ 3D model functional
6. Test payment integration (Razorpay)
7. Deploy to production

---

**Version**: 1.0.0  
**Last Updated**: November 12, 2025  
**Status**: ✅ All Core Features Fixed & Ready for Testing

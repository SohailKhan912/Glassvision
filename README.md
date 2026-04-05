# GlassVision - Full-Stack E-commerce Platform

GlassVision is a modern, high-performance full-stack e-commerce platform specializing in premium glass products. It features a Next.js frontend and an Express backend, providing a seamless user experience and robust administration.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **3D Visualization**: Three.js, React Three Fiber
- **State Management**: React Context API
- **Deployment**: Vercel / Netlify

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT, BcryptJS
- **Payments**: Razorpay
- **Deployment**: Render / Railway

---

## 🛠️ Project Structure

The project is organized into a monorepo structure:
- `frontend/`: Next.js application (pages, components, assets).
- `backend/`: Express.js server (routes, models, controllers).

---

## 🏗️ Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- Razorpay account (for payments)

### 2. Clone the Repository
```bash
git clone <your-repo-link>
cd glassvision
```

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env`.
5. Start the development server:
   ```bash
   npm run dev
   ```

### 4. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
4. Update `NEXT_PUBLIC_API_URL` to point to your backend.
5. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment

### Backend (Render/Railway)
1. Connect your GitHub repository to Render/Railway.
2. Set the root directory to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Configure environment variables in the platform dashboard.

### Frontend (Vercel)
1. Import the repository into Vercel.
2. Set the framework to **Next.js**.
3. Set the root directory to `frontend`.
4. Add environment variables, especially `NEXT_PUBLIC_API_URL`.
5. Deploy!

---

## 🔗 Live Demo
- **Frontend**: [Coming soon...]
- **Backend API**: [Coming soon...]

---

## 📝 License
This project is licensed under the ISC License.

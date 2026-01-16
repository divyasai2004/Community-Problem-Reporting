# Community Problem Reporting System - Project Overview

## Project Description

A full-stack web application that allows community members to report issues (complaints) in their neighborhood. The platform connects residents with administrators to track and resolve community problems efficiently.

---

## Architecture Overview

### **Technology Stack**

#### **Frontend:**
- **Framework:** React 19.2.3
- **Routing:** React Router DOM 7.11.0
- **HTTP Client:** Axios 1.13.2
- **Styling:** Custom CSS with modern dark theme
- **State Management:** React Hooks (useState, useEffect)

#### **Backend:**
- **Runtime:** Node.js
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB (via Mongoose 9.0.0)
- **Authentication:** JWT (JSON Web Tokens) using jsonwebtoken 9.0.3
- **Password Hashing:** bcryptjs 3.0.3
- **File Upload:** Multer 2.0.2
- **Environment Variables:** dotenv 17.2.3
- **CORS:** cors 2.8.5

---

##  Project Structure

```
Community-Problem-Reporting/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── initAdmin.js       # Admin user initialization
│   ├── controllers/
│   │   ├── userController.js  # User registration, login, get all users
│   │   └── complaintController.js  # CRUD operations for complaints
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication
│   │   ├── adminMiddleware.js # Admin role verification
│   │   └── uploadMiddleware.js # Multer file upload configuration
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Complaint.js       # Complaint schema
│   ├── routes/
│   │   ├── userRoutes.js      # User API endpoints
│   │   └── complaintRoutes.js # Complaint API endpoints
│   ├── scripts/
│   │   └── verifyAdmin.js     # Admin verification script
│   ├── uploads/               # Stored uploaded images
│   └── server.js              # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js      # Navigation bar
    │   │   ├── ComplaintForm.js  # Complaint submission form
    │   │   └── ComplaintList.js  # Display user complaints
    │   ├── pages/
    │   │   ├── Landing.js     # Landing page
    │   │   ├── Login.js       # User login page
    │   │   ├── Register.js    # User registration page
    │   │   ├── Dashboard.js   # User dashboard
    │   │   └── AdminDashboard.js  # Admin dashboard
    │   ├── services/
    │   │   └── api.js         # Axios API configuration
    │   ├── App.js             # Main app component with routing
    │   └── index.js           # React entry point
    └── public/                # Static files
```

---

##  Core Features

### **1. User Management**
-  User Registration (name, email, password, address)
-  User Login with JWT authentication
-  Password encryption using bcryptjs
-  Role-based access (user/admin)
-  Admin user auto-initialization

### **2. Complaint Management**
-  Submit complaints with:
  - Title
  - Category
  - Description
  - Location
  - Image upload (optional)
-  View own complaints (users)
-  View all complaints (admin)
-  Status tracking (Pending, In Progress, Resolved)
-  Real-time status updates

### **3. Admin Features**
-  View all registered users
-  View all complaints from all users
-  Update complaint status
-  User management dashboard
-  Statistics (Pending, In Progress, Resolved counts)

### **4. Frontend Features**
-  Beautiful dark-themed UI
-  Responsive design
-  Landing page with features showcase
-  Smooth animations and transitions
-  Image upload with preview
-  Auto-refresh for status updates

---

## Authentication & Authorization

### **Authentication Flow:**
1. User registers → Password hashed with bcrypt
2. User logs in → Server validates credentials
3. JWT token generated with user ID and role
4. Token stored in localStorage
5. Token sent in Authorization header for protected routes

### **Authorization Levels:**
- **Public Routes:** Landing, Login, Register
- **User Routes:** Dashboard (requires auth token)
- **Admin Routes:** Admin Dashboard, Get All Users, Update Status (requires auth + admin role)

### **Middleware Chain:**
1. `authMiddleware` - Validates JWT token
2. `adminMiddleware` - Checks if user role is "admin"

---

## Database Schema

### **User Model:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  address: String,
  role: String (default: "user"), // "user" or "admin"
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### **Complaint Model:**
```javascript
{
  user: ObjectId (ref: User),
  title: String (required),
  category: String (required),
  description: String (required),
  location: String (required),
  image: String (optional),
  status: String (default: "Pending"), // "Pending", "In Progress", "Resolved"
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## API Endpoints

### **User Routes (`/api/users`):**
- `POST /register` - Register new user
- `POST /login` - User login (returns JWT token)
- `GET /all` - Get all users (Admin only)

### **Complaint Routes (`/api/complaints`):**
- `POST /add` - Submit complaint (Auth required, supports file upload)
- `GET /my` - Get user's own complaints (Auth required)
- `GET /all` - Get all complaints (Admin only)
- `PUT /status/:id` - Update complaint status (Admin only)

---

## UI/UX Features

### **Design:**
- Modern dark theme (#0a0a0a background)
- Purple/Blue gradient accents
- Glassmorphism effects
- Smooth animations and transitions
- Responsive grid layouts
- Custom scrollbar styling

### **Pages:**
1. **Landing Page** - Marketing page with features and how it works
2. **Login/Register** - Authentication pages
3. **User Dashboard** - Submit and view own complaints
4. **Admin Dashboard** - Manage all users and complaints

---

## Security Features

1. **Password Security:**
   - Bcrypt hashing (10 salt rounds)
   - Passwords never sent to frontend

2. **Authentication:**
   - JWT tokens for stateless auth
   - Token expiration handling
   - Secure token storage

3. **Authorization:**
   - Role-based access control
   - Route protection middleware
   - Admin-only endpoints

4. **File Upload:**
   - File type validation (jpg, jpeg, png only)
   - Unique filename generation
   - Secure file storage

5. **CORS:**
   - Configured for frontend-backend communication

---

## How to Run

## **Backend:**
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URL=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000
npm start  # or npm run dev for nodemon
```

### **Frontend:**
```bash
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

---

## Key Implementation Details

### **File Upload:**
- Uses Multer for handling multipart/form-data
- Files stored in `/backend/uploads` directory
- Images served statically at `/uploads/:filename`
- File validation ensures only images are uploaded

### **State Management:**
- React hooks for component-level state
- localStorage for persistent auth tokens
- Auto-refresh mechanism (30s interval for complaints)

### **Error Handling:**
- Try-catch blocks in all async functions
- Proper HTTP status codes
- User-friendly error messages
- Console logging for debugging


# 📚 Library Management System

**A comprehensive full-stack Library Management System for efficient book tracking and user management**

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Overview

A modern, scalable **Library Management System** designed to streamline library operations. Built with the MERN stack (MongoDB, Express.js, React, Node.js), this system provides robust functionality for managing books, users, and borrowing workflows with role-based access control.

**Author:** Prabin K.C.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login
- Role-based access control (Admin / Librarian / Student)
- JWT-based authentication with token refresh
- Password encryption using bcrypt
- Protected routes and API endpoints

### 📚 Book Management
- Add, update, and delete books (Admin/Librarian only)
- Browse complete book catalog
- Advanced search and filtering capabilities
- Real-time availability tracking
- Book categorization and tagging
- ISBN validation

### 🔄 Borrowing System
- Seamless book issue and return process
- Comprehensive borrowing history
- Automated due date tracking
- Overdue notifications
- Fine calculation system
- Borrowing limit enforcement

### 👥 User Management
- Manage students and librarian accounts
- View individual user borrowing history
- User activity tracking
- Profile management
- Account suspension/activation

### 🎨 User Interface
- Clean, intuitive interface
- Responsive design for all devices
- Real-time updates
- Toast notifications for user feedback
- Loading states and error handling

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

### Development Tools
- **Vite** - Fast build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart server

---

## 📁 Project Structure

```
Library-Management-System/
│
├── backend/
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── bookController.js
│   │   │   └── borrowController.js
│   │   ├── models/               # Database schemas
│   │   │   ├── User.js
│   │   │   ├── Book.js
│   │   │   └── Borrow.js
│   │   ├── routes/               # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── bookRoutes.js
│   │   │   └── borrowRoutes.js
│   │   ├── middlewares/          # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/                # Utility functions
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   ├── config/               # Configuration files
│   │   │   └── database.js
│   │   └── app.js                # Express app setup
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── BookCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Books.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/              # Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── services/             # API service layer
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── utils/                # Helper functions
│   │   ├── App.jsx               # Root component
│   │   └── main.jsx              # Entry point
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/library-management-system.git
cd library-management-system
```

### 2️⃣ Backend Setup

Navigate to backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/library
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

Start the backend server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:8000`

### 3️⃣ Frontend Setup

Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

Start the development server:
```bash
npm run dev
```

The frontend application will run on `http://localhost:5173`

---

## 🔗 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "student" | "librarian" | "admin"
}
```

#### Login
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Get Current User
```http
GET /api/v1/users/me
Authorization: Bearer <token>
```

### Book Endpoints

#### Get All Books
```http
GET /api/v1/books
Query Parameters:
  - search: string
  - category: string
  - available: boolean
  - page: number
  - limit: number
```

#### Get Book by ID
```http
GET /api/v1/books/:id
```

#### Create Book (Admin/Librarian)
```http
POST /api/v1/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "author": "string",
  "isbn": "string",
  "category": "string",
  "quantity": number,
  "description": "string"
}
```

#### Update Book (Admin/Librarian)
```http
PUT /api/v1/books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "author": "string",
  "quantity": number
}
```

#### Delete Book (Admin)
```http
DELETE /api/v1/books/:id
Authorization: Bearer <token>
```

### Borrowing Endpoints

#### Borrow Book
```http
POST /api/v1/borrow
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "string",
  "userId": "string"
}
```

#### Return Book
```http
POST /api/v1/borrow/return/:borrowId
Authorization: Bearer <token>
```

#### Get User Borrowing History
```http
GET /api/v1/borrow/history/:userId
Authorization: Bearer <token>
```

#### Get All Borrowed Books (Admin/Librarian)
```http
GET /api/v1/borrow
Authorization: Bearer <token>
Query Parameters:
  - status: "borrowed" | "returned" | "overdue"
  - userId: string
```

---

## 👤 User Roles & Permissions

| Feature | Admin | Librarian | Student |
|---------|-------|-----------|---------|
| View Books | ✅ | ✅ | ✅ |
| Add Books | ✅ | ✅ | ❌ |
| Edit Books | ✅ | ✅ | ❌ |
| Delete Books | ✅ | ❌ | ❌ |
| Borrow Books | ✅ | ✅ | ✅ |
| Return Books | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ |
| View All Transactions | ✅ | ✅ | ❌ |

---

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token-based authentication
- HTTP-only cookies for token storage
- Protected API routes with middleware
- Input validation and sanitization
- Rate limiting on authentication endpoints
- XSS protection
- CORS configuration

---

## 🎯 Future Enhancements

- [ ] Email notifications for due dates
- [ ] Advanced analytics dashboard
- [ ] Book recommendation system
- [ ] QR code generation for books
- [ ] Mobile application
- [ ] Fine payment integration
- [ ] Book reservation system
- [ ] Multi-language support
- [ ] Export reports (PDF/Excel)
- [ ] Real-time chat support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Prabin K.C.**

- GitHub: [@kcprabin](https://github.com/kcprabin)
- LinkedIn: [kcprabin](https://www.linkedin.com/in/prabin-k-c-36159036b/)
- Email: kcprabin2063@gmail.com

---

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js community
- MongoDB documentation
- All contributors and supporters

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/library-management-system/issues) page
2. Create a new issue with detailed description
3. Contact the author via email

---

<div align="center">
  
**⭐ Star this repository if you find it helpful!**

Made with ❤️ by Prabin K.C.

</div>

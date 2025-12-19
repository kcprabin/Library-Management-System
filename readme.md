# 📚 Library Management System (LMS)

By -

A full-stack **Library Management System** built with **React**, **Node.js (Express)**, and **MongoDB**. This system manages books, users, borrowing/returning workflows, and authentication with a clean and scalable architecture.

---

## 🚀 Features

### 👤 Authentication & Authorization

* User registration and login
* Role-based access (Admin / Librarian / Student)
* JWT-based authentication
* Password hashing with bcrypt

### 📖 Book Management

* Add, update, delete books (Admin/Librarian)
* View all available books
* Search and filter books
* Track book availability

### 🔄 Borrow & Return System

* Issue books to users
* Return books
* Track borrowed history
* Due-date tracking

### 🧑‍🎓 User Management

* Manage students and librarians
* View user borrowing history

### 🖥️ Frontend

* Built with React
* React Router for navigation
* Axios for API calls
* Clean UI with reusable components

---

## 🛠️ Tech Stack

### Frontend

* React
* React Router DOM
* Axios
* Tailwind CSS / CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Tokens)
* bcrypt

---

## 📂 Project Structure

```
Library-Management-System/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   └── main.jsx
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/library-management-system.git
cd library-management-system
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/library
JWT_SECRET=your_secret_key
```

Start backend server:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔗 API Endpoints (Sample)

### Auth

* `POST /api/v1/users/register`
* `POST /api/v1/users/login`

### Books

* `GET /api/v1/books`
* `POST /api/v1/books`
* `PUT /api/v1/books/:id`
* `DELETE /api/v1/books/:id`

### Borrowing

* `POST /api/v1/borr

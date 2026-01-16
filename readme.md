# Library Management System

An open‑source Library Management System built with a **Node.js/Express + MongoDB** backend and a **React + Vite + Tailwind CSS** frontend. It provides role‑based dashboards for **Admins** and **Students** to manage books, track borrow/return status, and handle user accounts.

This project is designed so that anyone can **clone, install, run, and contribute** to it.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
	- [Admin Features](#admin-features)
	- [Student Features](#student-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
	- [Backend Setup](#backend-setup)
	- [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
	- [Backend](#backend)
	- [Frontend](#frontend)
- [API Overview](#api-overview)
- [Contributing](#contributing)
- [License](#license)
- [Author & Contact](#author--contact)
- [Future Improvements](#future-improvements)

## Overview

The Library Management System is a full‑stack web application for managing a library's day‑to‑day operations. It supports two main roles:

- **Admin** – manages books, monitors borrow/return activity, and oversees members.
- **Student** – browses available books, issues and returns books, and tracks personal borrowing history.

The project is **open source**, and anyone is welcome to **install, run, and contribute** to enhance its features or adapt it for their own institution.

## Features

### Admin Features

- Add new books with details and (optionally) cover images.
- View all books with information such as availability and status.
- See which books are **issued**, **not returned**, or **returned**.
- Manage library members/students and view their borrowing activity.
- Issue and accept return of books for students.
- Dashboard overview of key library statistics (e.g., total books, issued books).

### Student Features

- Register and log in to a personal student account.
- Browse available books and view details.
- Request/issue books (subject to library rules).
- View currently issued books and their status.
- Return books and see history of previously borrowed books.
- Access a personalized dashboard showing relevant library activity.

## Tech Stack

**Backend**

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Multer for file uploads
- Cloudinary for image/file storage
- dotenv for environment configuration

**Frontend**

- React (via Vite)
- React Router DOM for client‑side routing
- React Context API for global auth state
- Tailwind CSS for styling
- Axios for HTTP requests
- react-hot-toast, custom modals, loaders, and reusable UI components

**Tooling**

- Vite for frontend dev/build tooling
- ESLint for linting
- Nodemon for backend development

## Architecture

The application follows a typical **client–server** architecture:

- The **backend** exposes a RESTful API built with Express. Routes are organized by role: admin, student, and general user. Controllers implement business logic, models define MongoDB schemas, and middleware handles authentication, authorization, file uploads, and error handling.
- The **frontend** is a single‑page application (SPA) built with React and Vite. It communicates with the backend via HTTP (using Axios), manages authentication state via a global context, and renders role‑based dashboards and views.

Authentication is handled using JWT tokens, with an auth middleware protecting secured routes and a ProtectedRoute component guarding restricted frontend routes.

## Installation & Setup

This project is designed so **anyone can clone, install, and run** it locally.

### Prerequisites

- Node.js (LTS)
- npm or yarn
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)
- Cloudinary account (for image uploads) or equivalent configuration

### Clone the Repository

```bash
git clone https://github.com/kcprabin/Library-Management-System.git
cd Library-Management-System
```

> Adjust the repository URL if your actual repo name/URL differs.

### Backend Setup

1. Navigate to the backend folder:

	 ```bash
	 cd backend
	 ```

2. Install dependencies:

	 ```bash
	 npm install
	 ```

3. Create a .env file in the backend directory and configure environment variables, for example:

	 ```env
	 PORT=5000
	 MONGODB_URI=your_mongodb_connection_string
	 JWT_SECRET=your_jwt_secret

	 CLOUDINARY_CLOUD_NAME=your_cloud_name
	 CLOUDINARY_API_KEY=your_cloudinary_api_key
	 CLOUDINARY_API_SECRET=your_cloudinary_api_secret
	 ```

4. Start the backend server (development):

	 ```bash
	 npm run dev
	 ```

	 Or production mode:

	 ```bash
	 npm start
	 ```

	 By default, the API will typically run on http://localhost:5000 (or the port you set in PORT).

### Frontend Setup

1. In a new terminal window/tab, navigate to the frontend folder:

	 ```bash
	 cd frontend
	 ```

2. Install dependencies:

	 ```bash
	 npm install
	 ```

3. Start the frontend development server:

	 ```bash
	 npm run dev
	 ```

	 Vite will start the app on a port like http://localhost:5173 by default. Check your terminal output for the exact URL.

## Usage

Once both servers are running:

- Open the frontend URL in your browser (e.g., http://localhost:5173).
- The frontend will communicate with the backend API (e.g., http://localhost:5000) for authentication and data operations.

### Typical User Flows

**Student**

1. Register a new account or log in using existing credentials.
2. Browse available books and view details.
3. Issue a book and see it appear in the "issued" or "current" list.
4. Return a book through the interface and observe its status update.
5. Review past borrowing history in the dashboard.

**Admin**

1. Log in as an admin user.
2. Access the admin dashboard to see key stats (e.g., total books, issued books, members).
3. Add new books via the NewBook form, including optional cover images.
4. View lists of issued, returned, and not‑returned books.
5. See and manage registered members/students.

> Default credentials, if any, can be documented here once configured (e.g., seeded admin account).

## Project Structure

### Backend

backend/

- .env – Environment configuration (not committed to version control).
- package.json – Backend dependencies and scripts (dev, start).
- public/ – Public/static assets; temp/ can be used for temporary uploads.
- src/
	- app.js – Express app configuration (middleware, routes).
	- constants.js – Application‑wide constants.
	- index.js – Server entry point and bootstrap logic.
	- db/index.js – MongoDB connection setup via Mongoose.
	- models/
		- user.model.js – User schema (students/admins).
		- book.model.js – Book schema and related fields.
		- borrow.model.js – Borrow/issue records and status.
	- controllers/
		- user.controller.js – User auth and profile logic.
		- student.controller.js – Student operations (issuing/returning, listing books, etc.).
		- admin.controller..js – Admin‑specific operations (manage books, members, stats).
	- routes/
		- user.routes.js – Auth and general user routes.
		- student.routes.js – Student‑facing endpoints.
		- admin.routes.js – Admin‑facing endpoints.
	- middleware/
		- auth.middleware.js – Auth/authorization checks (e.g., verify JWT, roles).
		- multer.middleware.js – File upload handling.
	- services/
		- cloudinary.service.js – Cloudinary configuration and helper methods.
	- utils/
		- asynchandler.js – Utility for wrapping async route handlers and propagating errors.

### Frontend

frontend/

- index.html – Base HTML template.
- package.json – Frontend dependencies and scripts (dev, build, preview, lint).
- vite.config.js – Vite configuration (including React and Tailwind setup).
- eslint.config.js – ESLint configuration.
- src/
	- main.jsx – React entry point, app bootstrap.
	- App.jsx – Root component, routes/layout wiring.
	- App.css, index.css – Global styles.
	- Pages/
		- Login.jsx, Register.jsx – Auth pages.
		- AdminDashboard.jsx – Admin dashboard view.
		- StudentDashboard.jsx – Student dashboard view.
	- admin/
		- NewBook.jsx – Form to add new books.
		- AdminBooks.jsx – List and manage books.
		- AdminNotReturn.jsx, AdminReturned.jsx – Views for not‑returned/returned books.
		- Issused.jsx – View of issued books.
		- Members.jsx – List of library members.
		- Cards.jsx – Card UI components for admin views.
	- student/
		- Issue.jsx – Issue a book.
		- StuBooks.jsx, StuCards.jsx – Student book listing and card components.
		- StuReturn.jsx – Return a book.
	- componets/ (shared components)
		- UserProfile.jsx – User profile UI.
		- common/
			- ConfirmModal.jsx – Reusable confirmation dialog.
			- LoadingSpinners.jsx – Loading indicators.
			- ProtectedRoute.jsx – Guards routes based on auth/role.
			- Toast.jsx – Toast notifications.
		- dashboard/
			- Adminsidebar.jsx, Studentsidebar.jsx – Role‑based sidebars.
			- Navbar.jsx – Top navigation.
			- Background.jsx, Content.jsx, SearchBar.jsx – Layout and search components.
	- context/
		- authcontext.jsx – Authentication context/provider.
	- fetch/
		- index.js – Centralized API request helpers (Axios instances, endpoints).
	- hooks/
		- useDashboardStats.js – Custom hook for fetching/aggregating dashboard metrics.

## API Overview

The backend exposes a RESTful API, typically namespaced under paths such as:

- /api/user – Authentication and general user operations (register, login, profile).
- /api/student – Student operations (list books, issue book, return book, view history).
- /api/admin – Admin operations (create/update/delete books, view members, view issued/returned/not‑returned books, stats).

Each route is implemented in a route file (for example, admin.routes.js) and delegates to the corresponding controller for business logic. Authentication and authorization middleware guard protected routes, ensuring only appropriate roles can access admin or student endpoints.

> For full API details, refer to the route and controller implementations in the backend source code.

## Contributing

Contributions are **very welcome**! This is an open‑source project, and you are encouraged to improve it, report issues, or add new features.

1. Fork the repository on GitHub.
2. Clone your fork locally.
3. Create a new feature branch:

	 ```bash
	 git checkout -b feature/your-feature-name
	 ```

4. Make your changes (code, tests, docs) and commit them with a clear message.
5. Push the branch to your fork.
6. Open a Pull Request against the main repository, describing your changes and motivation.

You can also open issues for bug reports, questions, or feature suggestions.

## License

This project is open source. A specific license (for example, MIT) can be added to this repository to formalize usage and contribution terms. Until then, please treat it as a community project intended for learning, experimentation, and extension.



- ## Author & Contact

- Author: Prabin K.C.
- GitHub: https://github.com/kcprabin
- LinkedIn: https://www.linkedin.com/in/prabin-k-c-36159036b/
- Email: your.email@example.com (replace with the maintainer’s actual email address)

If you are using or extending this project, feel free to reach out or share your work.

## Future Improvements

Some possible enhancements and next steps:

- Advanced search and filtering for books (by author, genre, availability).
- Fine/penalty calculation for overdue books.
- Detailed reports and analytics for admins (usage, popular books, trends).
- Email or in‑app notifications for due dates and overdue reminders.
- Role and permission management UI for admins.
- Improved UI/UX design and additional themes.
- Comprehensive automated tests for backend and frontend.
- Dockerization for easier deployment.

Contributions in any of these areas (and beyond) are highly appreciated.

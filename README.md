# Library Management System

A modern web application for managing library resources efficiently. This system facilitates book tracking, user management, and streamlines the borrowing process with an intuitive interface.

## 🚀 Features

- **User Authentication**
  - Secure login and signup
  - Role-based access (Member/Admin)
  - Password reset functionality

- **Member Dashboard**
  - Overview of borrowed and returned books
  - Fine calculation for overdue items
  - Transaction history with status indicators

- **Profile Management**
  - Personal information editing
  - Profile photo upload and storage
  - Password management

- **Book Management**
  - Comprehensive book catalog
  - Search and filter functionality
  - Book details with availability status

- **Borrowing System**
  - Book reservation
  - Due date tracking
  - Return processing

- **Admin Features**
  - User management
  - Book inventory control
  - Reports and statistics

## 🛠️ Technologies

- **Frontend**
  - React (with TypeScript)
  - TailwindCSS for styling
  - React Router for navigation
  - Context API for state management

- **Backend**
  - Node.js with Express
  - MongoDB for database
  - JWT for authentication
  - RESTful API architecture

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🚀 Installation and Setup

### Clone the repository
```bash
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system
```

### Backend setup
```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and JWT secret
npm start
```

### Frontend setup
```bash
cd frontend
npm install
npm start
```

## 📱 Usage

### Member Workflow
1. Register or login to your account
2. Browse available books in the catalog
3. Reserve books of interest
4. Visit the library to collect reserved books
5. Return books before due date to avoid fines
6. Check your borrowing history and status

### Admin Workflow
1. Login with admin credentials
2. Manage book inventory (add, edit, delete)
3. Process member requests (reservations, returns)
4. Manage user accounts
5. Generate and view reports

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📸 Screenshots

![Dashboard](screenshots/dashboard.png)
![Book Catalog](screenshots/catalog.png)
![Profile Page](screenshots/profile.png)

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/library-management-system](https://github.com/yourusername/library-management-system) 

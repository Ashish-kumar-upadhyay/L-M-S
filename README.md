# Library Management System (LMS)

## Live Demo
Visit the live application: [Library Management System](https://lib-mang-system.netlify.app/)

## Overview
A modern, responsive library management system that allows users to browse books, create accounts, borrow books, and manage their reading activities. Administrators can manage the book inventory, track borrowed books, and analyze user data.

## Features
- **User Authentication**: Secure signup, login and profile management
- **Book Catalog**: Browse, search and view detailed information about books
- **Book Management**: Borrow, return, and track reading history
- **Responsive Design**: Optimized for desktop and mobile devices
- **Admin Dashboard**: Special access for administrators to manage library resources

## Technologies Used

### Frontend
- React.js with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Node.js and Express.js
- MongoDB for database
- JWT for authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

### Installation and Setup

#### Frontend
```bash
# Navigate to frontend directory
cd L-M-S/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

#### Backend
```bash
# Navigate to backend directory
cd L-M-S/backend

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with the following:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Start development server
npm run dev

# Start for production
npm start
```

## API Documentation

The API follows RESTful principles and includes endpoints for:

- Authentication (login, register, profile)
- Books (list, detail, search, borrow, return)
- User management (profile update, password change)

For detailed API documentation, see the API.md file.

## Deployment

### Frontend
The frontend is deployed on Netlify: [https://lib-mang-system.netlify.app/](https://lib-mang-system.netlify.app/)

### Backend
The backend API is deployed on Render: [https://l-m-s-1-bmg6.onrender.com/api](https://l-m-s-1-bmg6.onrender.com/api)

## Project Structure
```
L-M-S/
├── frontend/             # React application
│   ├── public/           # Public assets
│   ├── src/              # Source files
│   │   ├── assets/       # Static assets
│   │   ├── components/   # React components
│   │   ├── context/      # Context providers
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── package.json      # Frontend dependencies
└── backend/              # Express server
    ├── controllers/      # Request handlers
    ├── models/           # Database models
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    └── package.json      # Backend dependencies
```

## Contributors
- Ajit

## License
This project is licensed under the MIT License - see the LICENSE file for details.

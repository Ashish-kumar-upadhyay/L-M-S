# Library Management System - Frontend

This is the frontend application for the Library Management System, built with React, TypeScript, and Tailwind CSS.

## Live Demo
Visit the live application: [Library Management System](https://lib-mang-system.netlify.app/)

## Features
- Modern, responsive UI for the library management system
- User authentication (login, signup, profile management)
- Book browsing and searching functionality
- Member dashboard for managing borrowed books
- Admin interfaces for system management

## Tech Stack
- **React** - Frontend framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **Context API** - State management

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure
```
src/
├── assets/       # Static assets (images, icons)
├── components/   # Reusable UI components
├── context/      # Context API providers
├── pages/        # Page components
├── services/     # API service layers
└── utils/        # Utility functions and helpers
```

## Environment Setup
Create a `.env` file in the root directory with the following variables:
```
VITE_API_URL=https://l-m-s-1-bmg6.onrender.com/api
```

## Deployment
The frontend is deployed on Netlify. Any pushes to the main branch will trigger a new deployment.

## API Integration
This frontend connects to a Node.js/Express backend API. See the main project README for details on the backend setup.

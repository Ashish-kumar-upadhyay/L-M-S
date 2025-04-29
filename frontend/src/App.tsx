import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MemberDashboard from './pages/MemberDashboard';
import Allbooks from './pages/Allbooks';
import Header from './components/Header';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContextProvider } from './context/AuthContext';
import Profile from './pages/Profile'; // You'll need to create this page later

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Header />
        <div className="App pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/books" element={<Allbooks />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard@member" 
              element={
                <ProtectedRoute>
                  <MemberDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all - 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthContextProvider>
  );
};

// Simple 404 component
const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10190D] to-[#1a2c15] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <h2 className="text-2xl font-medium text-white">Page Not Found</h2>
        <p className="text-gray-300">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <a 
            href="/" 
            className="px-6 py-3 bg-[#E9534B] text-white font-medium rounded-lg hover:bg-[#d4483f] transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;

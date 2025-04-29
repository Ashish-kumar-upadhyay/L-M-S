import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { authAPI } from '../utils/api';

function Header() {
  const [menutoggle, setMenutoggle] = useState(false);
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      dispatch({ type: "LOGOUT" });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-[#10190D] shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-[#E9534B] text-2xl font-bold">
            LIBRARY
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 justify-center px-4 max-w-xl mx-4">
            <input
              type="text"
              placeholder="Search a Book"
              className="w-full px-4 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E9534B]"
            />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-[#E9534B] hover:text-[#F6E9CA] font-bold">
              Home
            </Link>
            <Link to="/books" className="text-[#E9534B] hover:text-[#F6E9CA] font-bold">
              Books
            </Link>
            {!user ? (
              <>
                <Link to="/signin" className="text-[#E9534B] hover:text-[#F6E9CA] font-bold">
                  Sign In
                </Link>
                <Link to="/signup" className="text-[#E9534B] hover:text-[#F6E9CA] font-bold">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard@member" className="text-[#E9534B] hover:text-[#F6E9CA] font-bold">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-[#E9534B] hover:text-[#F6E9CA] font-bold flex items-center">
                  <FiUser className="mr-1" />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-[#E9534B] hover:text-[#F6E9CA] font-bold flex items-center"
                >
                  <FiLogOut className="mr-1" />
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenutoggle(!menutoggle)}
            className="md:hidden text-[#E9534B]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menutoggle ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menutoggle && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-[#E9534B] hover:text-[#F6E9CA] font-bold text-center"
                onClick={() => setMenutoggle(false)}
              >
                Home
              </Link>
              <Link
                to="/books"
                className="text-[#E9534B] hover:text-[#F6E9CA] font-bold text-center"
                onClick={() => setMenutoggle(false)}
              >
                Books
              </Link>
              {!user ? (
                <>
                  <Link
                    to="/signin"
                    className="text-[#E9534B] hover:text-[#F6E9CA] font-bold text-center"
                    onClick={() => setMenutoggle(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-[#E9534B] hover:text-[#F6E9CA] font-bold text-center"
                    onClick={() => setMenutoggle(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard@member"
                    className="text-[#E9534B] hover:text-[#F6E9CA] font-bold text-center"
                    onClick={() => setMenutoggle(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="text-[#E9534B] hover:text-[#F6E9CA] font-bold text-center flex justify-center items-center"
                    onClick={() => setMenutoggle(false)}
                  >
                    <FiUser className="mr-1" />
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMenutoggle(false);
                    }}
                    className="text-[#E9534B] hover:text-[#F6E9CA] font-bold text-center flex justify-center items-center w-full"
                  >
                    <FiLogOut className="mr-1" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

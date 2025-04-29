import React, { useState, useEffect, useContext, useRef } from 'react';
import { FiUser, FiMail, FiEdit, FiSave, FiX, FiCamera, FiUpload } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../utils/api';

const Profile: React.FC = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getProfile();
        
        if (response.data.user) {
          setFormData({
            username: response.data.user.username || '',
            email: response.data.user.email || '',
            firstName: response.data.user.firstName || '',
            lastName: response.data.user.lastName || ''
          });
          
          // Update the auth context with the latest user data
          dispatch({ 
            type: "LOGIN_SUCCESS", 
            payload: response.data.user 
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
    
    // Load profile image from localStorage if exists
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setIsLoading(true);
      const response = await userAPI.updateProfile(formData);
      
      if (response.data) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        
        // Update the auth context with the updated user data
        if (response.data.user) {
          dispatch({ 
            type: "LOGIN_SUCCESS", 
            payload: response.data.user 
          });
        }
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || 'Failed to update profile');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate password
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data) {
        setSuccess('Password updated successfully');
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || 'Failed to update password');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Password update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      setProfileImage(imageDataUrl);
      
      // Save to localStorage
      localStorage.setItem('profileImage', imageDataUrl);
      
      setSuccess('Profile picture updated successfully');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10190D] to-[#1a2c15] pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white">Your Profile</h2>
            <p className="text-gray-300">Manage your account information</p>
          </div>

          {/* Profile picture */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#E9534B]/30 cursor-pointer bg-white/5 flex items-center justify-center"
                onClick={handleProfileImageClick}
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div 
                className="absolute bottom-0 right-0 bg-[#E9534B] p-2 rounded-full cursor-pointer hover:bg-[#d4483f] transition-colors shadow-lg"
                onClick={handleProfileImageClick}
              >
                <FiCamera className="w-5 h-5 text-white" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg, image/gif"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 mb-6 rounded-lg relative animate-shake" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-200 px-4 py-3 mb-6 rounded-lg relative" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-white">Personal Information</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-[#E9534B] hover:text-white transition-colors"
              >
                <FiEdit className="mr-2" />
                Edit
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="mr-2" />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="username" className="block text-gray-300 mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing || isLoading}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9534B] focus:border-transparent transition-all duration-300 ${
                      !isEditing ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing || isLoading}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9534B] focus:border-transparent transition-all duration-300 ${
                      !isEditing ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="firstName" className="block text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`appearance-none block w-full px-4 py-3 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9534B] focus:border-transparent transition-all duration-300 ${
                    !isEditing ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`appearance-none block w-full px-4 py-3 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9534B] focus:border-transparent transition-all duration-300 ${
                    !isEditing ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex items-center px-6 py-3 text-white font-medium rounded-lg transition-all ${
                    isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#E9534B] hover:bg-[#d4483f] hover:shadow-lg'
                  }`}
                >
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <FiSave className="mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>

          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">Change Password</h3>
              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center text-[#E9534B] hover:text-white transition-colors"
                >
                  <FiEdit className="mr-2" />
                  Change Password
                </button>
              ) : (
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="mr-2" />
                  Cancel
                </button>
              )}
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordUpdate}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-gray-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9534B] focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9534B] focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9534B] focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center px-6 py-3 text-white font-medium rounded-lg transition-all ${
                      isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#E9534B] hover:bg-[#d4483f] hover:shadow-lg'
                    }`}
                  >
                    {isLoading && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <FiSave className="mr-2" />
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
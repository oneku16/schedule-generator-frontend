import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Calendar, LogOut, User } from 'lucide-react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Cohort Scheduler
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <a 
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/dashboard');
                  }}
                >
                  Dashboard
                </a>
                <a 
                  href="/schedule"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/schedule');
                  }}
                >
                  Schedule
                </a>
              </>
            )}
          </nav>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  icon={<LogOut size={16} />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { LogOut, User, Home, Video, Gift, Menu, X, Globe } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Watch Ads', href: '/ads', icon: Video },
    { name: 'Rewards', href: '/rewards', icon: Gift },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Watch & Earn</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Balance: {formatCurrency(user?.balance || 0, user?.currency)}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t">
                <span className="block px-3 py-2 text-sm text-gray-700">
                  Balance: {formatCurrency(user?.balance || 0, user?.currency)}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-gray-700 hover:text-red-600 px-3 py-2 text-base font-medium"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Watch & Earn</h3>
              <p className="text-gray-600 mb-4">
                Earn money by watching advertisements. Join thousands of users who are already earning 
                rewards with our secure and reliable platform.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-sm text-gray-600 hover:text-blue-600">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">
                  Email: support@watchandearn.com
                </li>
                <li className="text-sm text-gray-600">
                  Phone: [Your Phone Number]
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Watch & Earn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Video, Gift, User } from 'lucide-react';

const MobileNavigation = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Home',
      href: '/dashboard',
      icon: Home,
      description: 'Overview'
    },
    {
      name: 'Earnings',
      href: '/ads',
      icon: Video,
      description: 'Watch ads'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Account'
    },
    {
      name: 'Withdraw',
      href: '/rewards',
      icon: Gift,
      description: 'Cash out'
    }
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="lg:hidden mobile-nav">
      <div className="flex justify-around">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`mobile-nav-item ${
              isActive(item.href) ? 'active' : ''
            }`}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;

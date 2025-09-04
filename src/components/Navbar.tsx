import React from 'react';
import { Code2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './auth/UserMenu';

interface NavbarProps {
  onAuthClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-400 rounded-xl flex items-center justify-center">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-custom-blue">
              ChatX3
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#fonctionnalites" className="text-gray-800 hover:text-custom-blue transition-colors font-medium">
              Fonctionnalités
            </a>
            <a href="#exemples" className="text-gray-800 hover:text-custom-blue transition-colors font-medium">
              Exemples
            </a>
            <a href="#tarifs" className="text-gray-800 hover:text-custom-blue transition-colors font-medium">
              Tarifs
            </a>
            <div className="flex items-center space-x-2 text-gray-800 font-medium">
              <span>FR</span>
              <span className="text-gray-400">FR</span>
            </div>
            <button className="p-2 text-gray-800 hover:text-custom-blue transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <button 
                onClick={onAuthClick}
                className="px-6 py-2 rounded-lg bg-custom-blue text-white font-medium hover:bg-custom-blue-dark transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
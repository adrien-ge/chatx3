import React from 'react';
import { Code2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './auth/UserMenu';
import LanguageSelector from './LanguageSelector';
import DarkModeToggle from './DarkModeToggle';

interface NavbarProps {
  onAuthClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

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
              {t('navigation.features')}
            </a>
            <a href="#exemples" className="text-gray-800 hover:text-custom-blue transition-colors font-medium">
              {t('navigation.examples')}
            </a>
            <a href="#tarifs" className="text-gray-800 hover:text-custom-blue transition-colors font-medium">
              {t('navigation.pricing')}
            </a>
            <LanguageSelector />
            <DarkModeToggle />
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <button 
                onClick={onAuthClick}
                className="px-6 py-2 rounded-lg bg-custom-blue text-white font-medium hover:bg-custom-blue-dark transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {t('auth.login.submit')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
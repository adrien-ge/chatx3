import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, ChevronDown, Settings, Crown, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu: React.FC<{ user: any }> = ({ user }) => {
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 bg-white/10 backdrop-blur-sm"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-white">{user.email}</p>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-300">En ligne</span>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-gradient-custom-blue rounded-xl shadow-2xl py-2 z-50 border border-white/20 backdrop-blur-sm">
            <div className="px-4 py-3 border-b border-white/20">
              <p className="text-sm text-gray-200">{user.email}</p>
            </div>
            
            <div className="py-2">
              <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/20 transition-all duration-300">
                <Settings className="h-4 w-4" />
                <span>{t('userMenu.accountSettings')}</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/20 transition-all duration-300">
                <Crown className="h-4 w-4" />
                <span>{t('userMenu.premiumPlan')}</span>
              </button>
            </div>
            
            <div className="border-t border-white/20 pt-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('userMenu.logout')}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
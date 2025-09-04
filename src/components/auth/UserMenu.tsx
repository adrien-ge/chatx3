import React, { useState } from 'react';
import { User, LogOut, Settings, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface UserMenuProps {
  user: {
    email: string;
    full_name?: string;
  };
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      setIsOpen(false);
      console.log('Starting logout process...');
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.replace('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 bg-white/10 backdrop-blur-sm"
        disabled={isLoggingOut}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium text-white">
          {user.full_name || user.email.split('@')[0]}
        </span>
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isOpen ? 'bg-green-400' : 'bg-white/60'
        }`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-3 w-64 bg-gradient-custom-blue rounded-2xl shadow-2xl py-2 z-50 border border-white/20 backdrop-blur-sm">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {user.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-200">{user.email}</p>
                </div>
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="py-2">
              <button className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-white/10 transition-all duration-300 hover:text-white">
                <Settings className="h-4 w-4 mr-3 text-gray-300" />
                Paramètres du compte
              </button>
              
              <button className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-white/10 transition-all duration-300 hover:text-white">
                <Crown className="h-4 w-4 mr-3 text-gray-300" />
                Plan Premium
              </button>
            </div>

            {/* Logout Button */}
            <div className="px-3 py-2 border-t border-white/20">
              <button
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 rounded-xl disabled:opacity-50"
              >
                <LogOut className="h-4 w-4 mr-3" />
                {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
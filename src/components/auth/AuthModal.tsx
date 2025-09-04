import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Bot, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, resetPassword } = useAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        onClose();
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return;
        }
        await signUp(email, password, { email, full_name: email.split('@')[0] });
        setSuccess('Compte créé avec succès ! Vérifiez votre email pour confirmer.');
      } else if (mode === 'reset') {
        await resetPassword(email);
        setSuccess('Email de réinitialisation envoyé !');
      }
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setMode('login');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-custom-blue rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-400 rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {mode === 'login' && t('auth.login.title')}
              {mode === 'register' && t('auth.register.title')}
              {mode === 'reset' && t('auth.resetPassword.title')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('auth.emailSent.title')}
              </h3>
              <p className="text-gray-300 mb-6">
                {t('auth.emailSent.description')}
              </p>
              <button
                onClick={() => setMode('login')}
                className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-500 transition-all duration-300"
              >
                {t('auth.emailSent.backToLogin')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {t('auth.login.email')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.placeholders.email')}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {mode !== 'reset' && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    {t('auth.login.password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.placeholders.password')}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    {t('auth.register.confirmPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('auth.placeholders.password')}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Chargement...</span>
                  </div>
                ) : (
                  <>
                    {mode === 'login' && t('auth.login.submit')}
                    {mode === 'register' && t('auth.register.submit')}
                    {mode === 'reset' && t('auth.resetPassword.submit')}
                  </>
                )}
              </button>

              {/* Links */}
              <div className="text-center space-y-2">
                {mode === 'login' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-green-400 hover:text-green-300 text-sm transition-colors"
                    >
                      {t('auth.login.forgotPassword')}
                    </button>
                    <div className="text-gray-300 text-sm">
                      {t('auth.login.noAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        {t('auth.login.createAccount')}
                      </button>
                    </div>
                  </>
                )}

                {mode === 'register' && (
                  <div className="text-gray-300 text-sm">
                    {t('auth.register.hasAccount')}{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      {t('auth.register.signIn')}
                    </button>
                  </div>
                )}

                {mode === 'reset' && (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-green-400 hover:text-green-300 text-sm transition-colors"
                  >
                    {t('auth.resetPassword.backToLogin')}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
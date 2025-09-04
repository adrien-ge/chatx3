import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail, CheckCircle, AlertCircle, User, Lock, Eye, EyeOff, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isSupabaseConfigured()) {
      setError('L\'authentification n\'est pas configurée. Veuillez contacter l\'administrateur.');
      return;
    }

    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }

    if (!isResetPassword && !password.trim()) {
      setError('Veuillez entrer votre mot de passe.');
      return;
    }

    setLoading(true);

    try {
      if (isResetPassword) {
        // Réinitialisation de mot de passe
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;
        
        setSuccess('Un email de réinitialisation a été envoyé à votre adresse. Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.');
        setShowEmailSent(true);
        
      } else if (isLogin) {
        // Connexion
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setError('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.');
          } else if (error.message.includes('Invalid login credentials')) {
            setError('Email ou mot de passe incorrect.');
          } else {
            throw error;
          }
        } else if (data.user) {
          // Connexion réussie
          onClose();
          resetForm();
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setSuccess(null);
    setIsResetPassword(false);
    setShowEmailSent(false);
    setIsLogin(true);
    setShowPassword(false);
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });
      
      if (error) throw error;
      
      setSuccess('Un nouvel email de confirmation a été envoyé. Vérifiez votre boîte de réception.');
    } catch (err) {
      console.error('Resend error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'envoi';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-custom-blue rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-white/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isResetPassword ? 'Réinitialiser le mot de passe' : (isLogin ? 'Se connecter' : 'Créer un compte')}
            </h2>
            <p className="text-gray-200">
              {isResetPassword 
                ? 'Entrez votre email pour recevoir un lien de réinitialisation'
                : 'Accédez à votre espace ChatX3'
              }
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {showEmailSent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email envoyé !</h3>
              <p className="text-gray-200 mb-6">{success}</p>
              <button
                onClick={resetForm}
                className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-500 transition-all duration-300 font-medium"
              >
                Retour à la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="votre@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              {!isResetPassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error/Success Messages */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <p className="text-sm text-green-300">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Chargement...</span>
                  </>
                ) : (
                  <span>
                    {isResetPassword ? 'Envoyer le lien' : (isLogin ? 'Se connecter' : 'Créer le compte')}
                  </span>
                )}
              </button>

              {/* Action Links */}
              <div className="text-center space-y-3">
                {!isResetPassword && (
                  <button
                    type="button"
                    onClick={() => setIsResetPassword(true)}
                    className="text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                )}

                {isResetPassword && (
                  <button
                    type="button"
                    onClick={() => setIsResetPassword(false)}
                    className="text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    Retour à la connexion
                  </button>
                )}

                {!isResetPassword && (
                  <div className="text-sm text-gray-300">
                    {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-green-400 hover:text-green-300 transition-colors font-medium"
                    >
                      {isLogin ? "Créer un compte" : "Se connecter"}
                    </button>
                  </div>
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
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePasswordReset = async () => {
      setCheckingToken(true);
      
      try {
        // Récupérer tous les paramètres possibles de l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Paramètres possibles
        const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
        const token = urlParams.get('token') || hashParams.get('token');
        const tokenHash = urlParams.get('token_hash') || hashParams.get('token_hash');
        const type = urlParams.get('type') || hashParams.get('type');

        console.log('Reset password - URL params:', {
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          token: token ? 'present' : 'missing',
          tokenHash: tokenHash ? 'present' : 'missing',
          type,
          fullUrl: window.location.href
        });

        // Vérifier le type de lien
        if (type !== 'recovery') {
          throw new Error('Ce lien n\'est pas valide pour la réinitialisation de mot de passe.');
        }

        // Méthode 1: Utiliser access_token et refresh_token (format moderne)
        if (accessToken && refreshToken) {
          console.log('Attempting session setup with tokens...');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Session setup failed:', error);
            throw error;
          }

          console.log('Session setup successful:', data);
          setIsValidToken(true);
          return;
        }

        // Méthode 2: Utiliser token_hash (format récent)
        if (tokenHash) {
          console.log('Attempting token hash verification...');
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery',
          });

          if (error) {
            console.error('Token hash verification failed:', error);
            throw error;
          }

          console.log('Token hash verification successful:', data);
          setIsValidToken(true);
          return;
        }

        // Méthode 3: Utiliser token simple (format ancien)
        if (token) {
          console.log('Attempting simple token verification...');
          
          const { data, error } = await supabase.auth.verifyOtp({
            token,
            type: 'recovery',
          });

          if (error) {
            console.error('Simple token verification failed:', error);
            throw error;
          }

          console.log('Simple token verification successful:', data);
          setIsValidToken(true);
          return;
        }

        // Si aucune méthode n'a fonctionné
        throw new Error('Aucun token valide trouvé dans l\'URL. Le lien peut être expiré ou invalide.');

      } catch (error) {
        console.error('Password reset verification error:', error);
        setError(
          error instanceof Error 
            ? error.message 
            : 'Lien de réinitialisation invalide ou expiré.'
        );
        setIsValidToken(false);
      } finally {
        setCheckingToken(false);
      }
    };

    handlePasswordReset();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!password.trim()) {
      setError('Veuillez entrer un mot de passe.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!isValidToken) {
      setError('Session invalide. Veuillez demander un nouveau lien de réinitialisation.');
      return;
    }

    setLoading(true);

    try {
      // Vérifier que l'utilisateur est bien authentifié
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Session expirée. Veuillez demander un nouveau lien de réinitialisation.');
      }

      // Mettre à jour le mot de passe
      const { error } = await supabase.auth.updateUser({
        password: password.trim()
      });

      if (error) throw error;

      setSuccess('Votre mot de passe a été mis à jour avec succès ! Vous allez être redirigé...');
      
      // Rediriger vers la page de chat après 3 secondes
      setTimeout(() => {
        navigate('/chat');
      }, 3000);

    } catch (err) {
      console.error('Password update error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Une erreur est survenue lors de la mise à jour du mot de passe.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Réinitialiser votre mot de passe
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {checkingToken 
            ? "Vérification du lien en cours..."
            : isValidToken 
              ? "Entrez votre nouveau mot de passe ci-dessous"
              : "Lien invalide ou expiré"
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {checkingToken ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Vérification du lien en cours...</p>
            </div>
          ) : !isValidToken ? (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-4 rounded-md mb-6 text-left">
                  <p className="font-medium mb-2">Erreur de validation du lien :</p>
                  <p>{error}</p>
                  <div className="mt-3 text-xs text-red-500 break-all">
                    <p><strong>URL reçue :</strong></p>
                    <p>{window.location.href}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={handleRequestNewLink}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Demander un nouveau lien
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          ) : (
            <>
              {success ? (
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-green-600 text-sm bg-green-50 p-4 rounded-md mb-6">
                    {success}
                  </div>
                  <button
                    onClick={() => navigate('/chat')}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Accéder à l'application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Nouveau mot de passe
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Entrez votre nouveau mot de passe"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Le mot de passe doit contenir au moins 6 caractères
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirmer le mot de passe
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Confirmez votre nouveau mot de passe"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Mise à jour...
                        </div>
                      ) : (
                        'Mettre à jour le mot de passe'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {!success && (
            <div className="mt-6">
              <div className="text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
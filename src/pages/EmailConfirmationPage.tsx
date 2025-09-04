import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, RefreshCw, AlertTriangle, Info, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EmailConfirmationPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_confirmed'>('loading');
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        setStatus('loading');
        
        // Vérifier si on vient de la page d'inscription avec un état
        const locationState = location.state as any;
        if (locationState?.registrationComplete) {
          setStatus('success');
          setMessage('Votre inscription a été enregistrée avec succès ! Un email de confirmation a été envoyé à votre adresse. Veuillez cliquer sur le lien dans l\'email pour activer votre compte.');
          return;
        }
        
        // Récupérer tous les paramètres de l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Tous les paramètres possibles
        const code = urlParams.get('code') || hashParams.get('code');
        const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
        const tokenHash = urlParams.get('token_hash') || hashParams.get('token_hash');
        const type = urlParams.get('type') || hashParams.get('type');
        const error = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');

        const debugData = {
          url: window.location.href,
          search: window.location.search,
          hash: window.location.hash,
          code: code ? 'present' : 'missing',
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          tokenHash: tokenHash ? 'present' : 'missing',
          type,
          error,
          errorDescription
        };
        
        setDebugInfo(debugData);
        console.log('Email confirmation debug info:', debugData);

        // Vérifier s'il n'y a aucun paramètre de confirmation
        if (!code && !accessToken && !refreshToken && !tokenHash && !error) {
          throw new Error('Aucun paramètre de confirmation trouvé dans l\'URL. Veuillez utiliser le lien exact reçu par email.');
        }

        // Vérifier s'il y a une erreur dans l'URL
        if (error) {
          throw new Error(`Erreur de confirmation: ${error} - ${errorDescription || 'Détails non disponibles'}`);
        }

        let result = null;

        // Méthode 1: Tokens directs (plus fiable que PKCE pour les emails)
        if (accessToken && refreshToken) {
          console.log('Tentative avec tokens directs...');
          
          const { data, error: tokenError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (tokenError) {
            console.error('Erreur tokens directs:', tokenError);
            
            // Vérifier si c'est un problème de lien déjà utilisé
            if (tokenError.message.includes('invalid_grant') || 
                tokenError.message.includes('invalid flow state') ||
                tokenError.message.includes('already been used')) {
              setStatus('already_confirmed');
              setMessage('Ce lien de confirmation a déjà été utilisé. Votre email est probablement déjà confirmé.');
              return;
            }
            
            throw new Error(`Échec de la confirmation avec les tokens: ${tokenError.message}`);
          }
          
          result = data;
        }
        // Méthode 2: Token hash
        else if (tokenHash) {
          console.log('Tentative avec token hash...');
          
          const { data, error: hashError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email',
          });

          if (hashError) {
            console.error('Erreur token hash:', hashError);
            
            // Vérifier si c'est un problème de lien déjà utilisé ou expiré
            if (hashError.message.includes('invalid_grant') || 
                hashError.message.includes('expired') ||
                hashError.message.includes('already been used') ||
                hashError.message.includes('token_expired')) {
              
              if (hashError.message.includes('expired')) {
                throw new Error('Le lien de confirmation a expiré. Les liens sont valides pendant 24 heures.');
              } else {
                setStatus('already_confirmed');
                setMessage('Ce lien de confirmation a déjà été utilisé. Votre email est probablement déjà confirmé.');
                return;
              }
            }
            
            throw new Error(`Échec de la confirmation avec le hash: ${hashError.message}`);
          }
          
          result = data;
        }
        // Méthode 3: Code PKCE (en dernier recours)
        else if (code) {
          console.log('Tentative avec code PKCE...');
          
          try {
            const { data, error: codeError } = await supabase.auth.exchangeCodeForSession(code);
            
            if (codeError) {
              console.error('Erreur échange code PKCE:', codeError);
              
              // Vérifier si c'est un problème de lien déjà utilisé
              if (codeError.message.includes('invalid_grant') || 
                  codeError.message.includes('already been used') ||
                  codeError.message.includes('code verifier')) {
                setStatus('already_confirmed');
                setMessage('Ce lien de confirmation a déjà été utilisé. Votre email est probablement déjà confirmé.');
                return;
              }
              
              // Si PKCE échoue, essayer la méthode OTP simple
              const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
                token: code,
                type: 'signup',
              });
              
              if (otpError) {
                if (otpError.message.includes('invalid_grant') || 
                    otpError.message.includes('already been used')) {
                  setStatus('already_confirmed');
                  setMessage('Ce lien de confirmation a déjà été utilisé. Votre email est probablement déjà confirmé.');
                  return;
                }
                throw new Error(`Échec de la confirmation: ${codeError.message}`);
              }
              
              result = otpData;
            } else {
              result = data;
            }
          } catch (pkceError) {
            console.error('PKCE failed, trying OTP method:', pkceError);
            
            // Fallback vers la méthode OTP
            const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
              token: code,
              type: 'signup',
            });
            
            if (otpError) {
              if (otpError.message.includes('invalid_grant') || 
                  otpError.message.includes('already been used')) {
                setStatus('already_confirmed');
                setMessage('Ce lien de confirmation a déjà été utilisé. Votre email est probablement déjà confirmé.');
                return;
              }
              throw new Error(`Toutes les méthodes de confirmation ont échoué. Dernier erreur: ${otpError.message}`);
            }
            
            result = otpData;
          }
        }

        // Vérifier le résultat
        if (!result || !result.session || !result.user) {
          throw new Error('La confirmation a réussi mais aucune session valide n\'a été créée.');
        }

        console.log('Confirmation réussie pour:', result.user.email);

        setStatus('success');
        setMessage('Votre email a été confirmé avec succès ! Votre compte est maintenant actif. Redirection vers l\'application...');
        
        // Redirection après 2 secondes
        setTimeout(() => {
          navigate('/chat', { replace: true });
        }, 2000);

      } catch (error) {
        console.error('Erreur de confirmation email:', error);
        setStatus('error');
        
        let errorMessage = 'Erreur lors de la confirmation de l\'email.';
        
        if (error instanceof Error) {
          if (error.message.includes('expired')) {
            errorMessage = 'Le lien de confirmation a expiré. Les liens sont valides pendant 24 heures.';
          } else if (error.message.includes('invalid_code') || error.message.includes('code verifier')) {
            errorMessage = 'Code de confirmation invalide. Cela peut être dû à une configuration Supabase. Essayez de demander un nouveau lien.';
          } else if (error.message.includes('already confirmed') || error.message.includes('email_confirmed')) {
            setStatus('already_confirmed');
            setMessage('Votre email a déjà été confirmé. Vous pouvez vous connecter.');
            return;
          } else {
            errorMessage = error.message;
          }
        }
        
        setMessage(errorMessage);
      }
    };

    confirmEmail();
  }, [navigate, location]);

  const handleRetryConfirmation = () => {
    navigate('/', { replace: true });
  };

  const handleRequestNewLink = () => {
    navigate('/register', { replace: true });
  };

  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="mx-auto h-12 w-12 text-primary-600 animate-spin" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Confirmation en cours...
                </h2>
                <p className="mt-2 text-gray-600">
                  Traitement de votre lien de confirmation...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Email confirmé !
                </h2>
                <div className="mt-4 text-green-600 text-sm bg-green-50 p-4 rounded-md">
                  <p className="font-medium mb-2">🎉 Félicitations !</p>
                  <p>{message}</p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/chat')}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Accéder à l'application
                  </button>
                </div>
              </>
            )}

            {status === 'already_confirmed' && (
              <>
                <Info className="mx-auto h-12 w-12 text-blue-600" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Lien déjà utilisé
                </h2>
                <div className="mt-4 text-blue-600 text-sm bg-blue-50 p-4 rounded-md">
                  <p className="font-medium mb-2">ℹ️ Information</p>
                  <p>{message}</p>
                  <p className="mt-2 text-blue-500">
                    Chaque lien de confirmation ne peut être utilisé qu'une seule fois pour des raisons de sécurité.
                  </p>
                </div>
                
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-left">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-green-800 text-sm font-medium mb-2">Votre compte est probablement actif :</p>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Votre email a été confirmé précédemment</li>
                        <li>• Votre compte est normalement accessible</li>
                        <li>• Vous pouvez vous connecter avec vos identifiants</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleRetryConfirmation}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Se connecter maintenant
                  </button>
                  
                  <button
                    onClick={handleRequestNewLink}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Problème de connexion ? Demander un nouveau lien
                  </button>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="mx-auto h-12 w-12 text-red-600" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Erreur de confirmation
                </h2>
                
                <div className="mt-4 text-red-600 text-sm bg-red-50 p-4 rounded-md text-left">
                  <p className="font-medium mb-2">Message d'erreur :</p>
                  <p className="mb-3">{message}</p>
                </div>

                {/* Informations de debug */}
                {debugInfo && (
                  <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-md text-left">
                    <p className="font-medium mb-2">Informations techniques :</p>
                    <div className="space-y-1">
                      <p><strong>URL:</strong> {debugInfo.url}</p>
                      <p><strong>Code:</strong> {debugInfo.code}</p>
                      <p><strong>Type:</strong> {debugInfo.type || 'non spécifié'}</p>
                      <p><strong>Erreur URL:</strong> {debugInfo.error || 'aucune'}</p>
                    </div>
                  </div>
                )}

                {/* Solutions recommandées */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 text-sm font-medium mb-2">Solutions recommandées :</p>
                      <ul className="text-blue-700 text-sm space-y-1">
                        {message.includes('expiré') ? (
                          <>
                            <li>• Les liens expirent après 24 heures</li>
                            <li>• Demandez un nouveau lien de confirmation</li>
                          </>
                        ) : message.includes('configuration Supabase') ? (
                          <>
                            <li>• Problème de configuration détecté</li>
                            <li>• Demandez un nouveau lien de confirmation</li>
                            <li>• Contactez le support si le problème persiste</li>
                          </>
                        ) : (
                          <>
                            <li>• Utilisez le lien exact reçu par email</li>
                            <li>• Ne modifiez pas l'URL du lien</li>
                            <li>• Copiez-collez le lien complet</li>
                            <li>• Vérifiez vos spams si vous ne trouvez pas l'email</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleRequestNewLink}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                  >
                    Demander un nouveau lien
                  </button>
                  
                  <button
                    onClick={handleRetryConfirmation}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Essayer de se connecter
                  </button>
                  
                  <button
                    onClick={handleTryAgain}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Building2, User, Mail, Lock, Settings, Briefcase, Users, Phone, ExternalLink, MessageSquare, CheckCircle, Home, ArrowLeft, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  companyName: string;
  companyCountry: string;
  sageX3Version: string;
  position: string;
  companySize: string;
  phone: string;
  website: string;
  challengesAndSuggestions: string;
  // Données tarifaires depuis la souscription
  selectedPlan: string;
  essentialUsers: number;
  analystUsers: number;
  developerUsers: number;
  isAnnual: boolean;
  apiAccess: boolean;
  customDoc: boolean;
}

const RegistrationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

  // Récupérer les données de souscription depuis la navigation
  const subscriptionData = location.state || {};

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: subscriptionData.fullName || '',
    companyName: subscriptionData.companyName || '',
    companyCountry: subscriptionData.companyCountry || '',
    sageX3Version: subscriptionData.sageX3Version || '',
    position: subscriptionData.position || '',
    companySize: subscriptionData.companySize || '',
    phone: subscriptionData.phone || '',
    website: subscriptionData.website || '',
    challengesAndSuggestions: subscriptionData.challenges || '',
    // Données tarifaires
    selectedPlan: subscriptionData.selectedPlan || 'starter',
    essentialUsers: subscriptionData.essentialUsers || 0,
    analystUsers: subscriptionData.analystUsers || 0,
    developerUsers: subscriptionData.developerUsers || 0,
    isAnnual: subscriptionData.isAnnual || false,
    apiAccess: subscriptionData.apiAccess || false,
    customDoc: subscriptionData.customDoc || false
  });

  // Liste des pays
  const countries = [
    'France', 'Belgique', 'Suisse', 'Luxembourg', 'Canada', 'Maroc', 'Tunisie', 'Algérie',
    'Allemagne', 'Espagne', 'Italie', 'Portugal', 'Pays-Bas', 'Royaume-Uni', 'États-Unis',
    'Autre'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Générer un domaine basé sur le site web ou email
      const domain = formData.website 
        ? formData.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
        : formData.email.split('@')[1];

      // Stocker les données du formulaire dans le localStorage pour les utiliser après confirmation
      const registrationData = {
        fullName: formData.fullName,
        companyName: formData.companyName,
        companyCountry: formData.companyCountry,
        companyDomain: domain,
        sageX3Version: formData.sageX3Version,
        position: formData.position,
        companySize: formData.companySize,
        phone: formData.phone,
        website: formData.website,
        challengesAndSuggestions: formData.challengesAndSuggestions,
        selectedPlan: formData.selectedPlan,
        essentialUsers: formData.essentialUsers,
        analystUsers: formData.analystUsers,
        developerUsers: formData.developerUsers,
        isAnnual: formData.isAnnual,
        apiAccess: formData.apiAccess,
        customDoc: formData.customDoc
      };

      localStorage.setItem('pendingRegistrationData', JSON.stringify(registrationData));

      // Procéder à l'inscription Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm-email`,
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        if (authError.message.includes('already registered')) {
          setError('Un utilisateur avec cette adresse email existe déjà. Veuillez vous connecter ou utiliser une autre adresse email.');
        } else {
          setError(authError.message);
        }
        return;
      }

      if (!authData.user) {
        setError('Erreur lors de la création du compte utilisateur.');
        return;
      }

      setSuccess('Inscription réussie ! Un email de confirmation a été envoyé à votre adresse. Veuillez cliquer sur le lien dans l\'email pour activer votre compte et créer votre entreprise.');
      setIsRegistrationComplete(true);

    } catch (error) {
      console.error('Registration error:', error);
      setError('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Calculer le coût estimé basé sur le plan sélectionné
  const calculateEstimatedCost = () => {
    if (formData.selectedPlan === 'starter') {
      return 9;
    }

    let totalCost = 0;
    totalCost += formData.essentialUsers * 19;
    totalCost += formData.analystUsers * 399;
    totalCost += formData.developerUsers * 1499;
    
    if (formData.apiAccess) totalCost += 499;
    if (formData.customDoc) totalCost += 1000;

    return formData.isAnnual ? Math.round(totalCost * 12 * 0.8) : totalCost;
  };

  // Si l'inscription est terminée avec succès, afficher la page de confirmation
  if (isRegistrationComplete && success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Inscription réussie !
            </h2>
            
            <div className="mb-8">
              <p className="text-green-800 text-lg mb-4">{success}</p>
              
              {/* Résumé de l'inscription */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">Résumé de votre inscription :</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• <strong>Plan sélectionné :</strong> {formData.selectedPlan === 'starter' ? 'Starter' : 'Entreprise'}</li>
                  {formData.selectedPlan === 'enterprise' && (
                    <>
                      <li>• <strong>Utilisateurs Essentiel :</strong> {formData.essentialUsers}</li>
                      <li>• <strong>Utilisateurs Analyste :</strong> {formData.analystUsers}</li>
                      <li>• <strong>Utilisateurs Développeur :</strong> {formData.developerUsers}</li>
                      {formData.isAnnual && <li>• <strong>Offre annuelle :</strong> Oui (-20%)</li>}
                      {formData.apiAccess && <li>• <strong>Accès API :</strong> Oui</li>}
                      {formData.customDoc && <li>• <strong>Documentation personnalisée :</strong> Oui</li>}
                    </>
                  )}
                  <li>• <strong>Coût estimé :</strong> {calculateEstimatedCost()}€{formData.isAnnual ? '/an' : '/mois'}</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">Prochaines étapes :</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Vérifiez votre boîte email (y compris les spams)</li>
                  <li>• Cliquez sur le lien de confirmation dans l'email</li>
                  <li>• Votre entreprise sera automatiquement créée lors de la confirmation</li>
                  <li>• Vous pourrez ensuite accéder à votre tableau de bord</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleBackToHome}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Retour à la page d'accueil
              </button>
              
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header avec bouton retour */}
        <div className="text-center">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Retour à l'accueil</span>
            </button>
            
            <div className="flex justify-center">
              <div className="bg-blue-600 p-3 rounded-full">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="w-32"></div> {/* Spacer pour centrer le logo */}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Créer votre compte
          </h2>
          <p className="text-gray-600">
            Rejoignez notre plateforme d'assistance Sage X3
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Affichage des informations tarifaires récupérées */}
          {formData.selectedPlan && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Configuration sélectionnée :</h3>
              <div className="text-blue-800 text-sm space-y-1">
                <p>• <strong>Plan :</strong> {formData.selectedPlan === 'starter' ? 'Starter' : 'Entreprise'}</p>
                {formData.selectedPlan === 'enterprise' && (
                  <>
                    <p>• <strong>Utilisateurs Essentiel :</strong> {formData.essentialUsers}</p>
                    <p>• <strong>Utilisateurs Analyste :</strong> {formData.analystUsers}</p>
                    <p>• <strong>Utilisateurs Développeur :</strong> {formData.developerUsers}</p>
                    {formData.isAnnual && <p>• <strong>Offre annuelle :</strong> Oui (-20%)</p>}
                    {formData.apiAccess && <p>• <strong>Accès API :</strong> Oui</p>}
                    {formData.customDoc && <p>• <strong>Documentation personnalisée :</strong> Oui</p>}
                  </>
                )}
                <p>• <strong>Coût estimé :</strong> {calculateEstimatedCost()}€{formData.isAnnual ? '/an' : '/mois'}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Informations personnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email professionnel *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Poste
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Informations de l'entreprise
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="companyCountry" className="block text-sm font-medium text-gray-700 mb-1">
                    Pays *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="companyCountry"
                      name="companyCountry"
                      value={formData.companyCountry}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Sélectionner un pays</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Site web de l'entreprise *
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="exemple.com"
                      pattern="^[^\s]*\.[^\s]*$"
                      title="Doit contenir au moins un point et pas d'espaces"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Doit contenir au moins un point et pas d'espaces
                  </p>
                </div>

                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                    Taille de l'entreprise
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Sélectionner</option>
                      <option value="1-10">1-10 employés</option>
                      <option value="11-50">11-50 employés</option>
                      <option value="51-200">51-200 employés</option>
                      <option value="201-500">201-500 employés</option>
                      <option value="500+">500+ employés</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sage X3 Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-600" />
                Configuration Sage X3
              </h3>
              
              <div>
                <label htmlFor="sageX3Version" className="block text-sm font-medium text-gray-700 mb-1">
                  Version Sage X3 *
                </label>
                <select
                  id="sageX3Version"
                  name="sageX3Version"
                  value={formData.sageX3Version}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Sélectionner une version</option>
                  <option value="V12">Sage X3 V12</option>
                  <option value="V11">Sage X3 V11</option>
                  <option value="V10">Sage X3 V10</option>
                  <option value="V9">Sage X3 V9</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="challengesAndSuggestions" className="block text-sm font-medium text-gray-700 mb-1">
                  Défis et suggestions
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="challengesAndSuggestions"
                    name="challengesAndSuggestions"
                    value={formData.challengesAndSuggestions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Décrivez vos principaux défis avec Sage X3 et vos suggestions d'amélioration..."
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
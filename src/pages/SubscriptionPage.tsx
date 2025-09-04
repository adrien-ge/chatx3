import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Users, 
  Zap, 
  TrendingUp, 
  Calculator,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Settings,
  CreditCard,
  CheckCircle,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SubscriptionData {
  // Plan selection
  selectedPlan: 'starter' | 'enterprise';
  
  // Enterprise plan
  essentialUsers: number;
  analystUsers: number;
  developerUsers: number;
  isAnnual: boolean;
  apiAccess: boolean;
  customDoc: boolean;
  
  // User info
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  position: string;
  
  // Company info
  companyName: string;
  companyCountry: string;
  companySize: string;
  website: string;
  
  // Sage X3 info
  sageX3Version: string;
  challenges: string;
}

const SubscriptionPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Récupérer les données de configuration depuis la navigation
  const configData = location.state || {};

  const [formData, setFormData] = useState<SubscriptionData>({
    selectedPlan: configData.plan || 'starter',
    essentialUsers: configData.essentialUsers || 50,
    analystUsers: configData.analystUsers || 1,
    developerUsers: configData.developerUsers || 0,
    isAnnual: configData.isAnnual || false,
    apiAccess: configData.apiAccess || false,
    customDoc: configData.customDoc || false,
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    position: '',
    companyName: '',
    companyCountry: '',
    companySize: '',
    website: '',
    sageX3Version: '',
    challenges: ''
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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const texts = {
    fr: {
      title: "Souscription Intell X3",
      subtitle: "Configurez votre solution en quelques étapes",
      
      steps: {
        plan: "Choix du plan",
        config: "Configuration",
        info: "Informations",
        summary: "Récapitulatif"
      },
      
      // Step 1: Plan Selection
      planSelection: {
        title: "Choisissez votre plan",
        subtitle: "Sélectionnez l'offre qui correspond le mieux à vos besoins",
        
        starter: {
          name: "Plan Starter",
          description: "Pour consultants et petites équipes",
          price: "9€ / mois",
          features: [
            "1 compte utilisateur",
            "100 000 tokens mensuels"
          ]
        },
        
        enterprise: {
          name: "Plan Entreprise",
          description: "Solution intégrée à votre ERP Sage X3"
        }
      },
      
      // Step 2: Configuration
      configuration: {
        title: "Configuration sélectionnée",
        subtitle: "Voici votre configuration actuelle",
        
        enterpriseConfig: {
          title: "Configuration Entreprise",
          rolesTitle: "Rôles utilisateurs",
          optionsTitle: "Options sélectionnées",
          
          roles: {
            essential: {
              name: "Essentiel",
              price: "19€"
            },
            analyst: {
              name: "Analyste",
              price: "399€"
            },
            developer: {
              name: "Développeur",
              price: "1 499€"
            }
          },
          
          options: {
            annual: "Offre Annuelle (-20%)",
            api: {
              name: "Accès API IA",
              price: "499€"
            },
            customDoc: {
              name: "Documentation Personnalisée",
              price: "1 000€"
            }
          }
        }
      },
      
      // Step 3: Information
      information: {
        title: "Vos informations",
        subtitle: "Complétez votre profil pour finaliser la souscription",
        
        personal: {
          title: "Informations personnelles",
          fullName: "Nom complet *",
          email: "Email professionnel *",
          password: "Mot de passe *",
          confirmPassword: "Confirmer le mot de passe *",
          phone: "Téléphone",
          position: "Poste"
        },
        
        company: {
          title: "Informations entreprise",
          companyName: "Nom de l'entreprise *",
          country: "Pays *",
          size: "Taille de l'entreprise",
          website: "Site web *"
        },
        
        sage: {
          title: "Configuration Sage X3",
          version: "Version Sage X3 *",
          challenges: "Défis et suggestions"
        }
      },
      
      // Step 4: Summary
      summary: {
        title: "Récapitulatif de votre souscription",
        subtitle: "Vérifiez les détails avant de finaliser",
        
        planDetails: "Détails du plan",
        userInfo: "Informations utilisateur",
        companyInfo: "Informations entreprise",
        
        monthlyTotal: "Total mensuel",
        yearlyTotal: "Total annuel (avec -20%)",
        
        finalizeButton: "Créer mon compte et finaliser"
      },
      
      // Common
      next: "Suivant",
      previous: "Précédent",
      backToHome: "Retour à l'accueil",
      perMonth: "par mois",
      users: "utilisateurs",
      
      // Countries
      countries: [
        "France", "Belgique", "Suisse", "Luxembourg", "Canada", 
        "Maroc", "Tunisie", "Algérie", "Allemagne", "Espagne", 
        "Italie", "Portugal", "Pays-Bas", "Royaume-Uni", "États-Unis", "Autre"
      ],
      
      // Company sizes
      companySizes: [
        "1-10 employés",
        "11-50 employés", 
        "51-200 employés",
        "201-500 employés",
        "500+ employés"
      ],
      
      // Sage versions
      sageVersions: [
        "Sage X3 V12",
        "Sage X3 V11", 
        "Sage X3 V10",
        "Sage X3 V9",
        "Autre"
      ]
    },
    
    en: {
      title: "Intell X3 Subscription",
      subtitle: "Configure your solution in a few steps",
      
      steps: {
        plan: "Plan Selection",
        config: "Configuration", 
        info: "Information",
        summary: "Summary"
      },
      
      // Step 1: Plan Selection
      planSelection: {
        title: "Choose your plan",
        subtitle: "Select the offer that best fits your needs",
        
        starter: {
          name: "Starter Plan",
          description: "For consultants and small teams",
          price: "€9 / month",
          features: [
            "1 user account",
            "100,000 monthly tokens"
          ]
        },
        
        enterprise: {
          name: "Enterprise Plan",
          description: "Solution integrated with your Sage X3 ERP"
        }
      },
      
      // Step 2: Configuration
      configuration: {
        title: "Selected configuration",
        subtitle: "Here is your current configuration",
        
        enterpriseConfig: {
          title: "Enterprise Configuration",
          rolesTitle: "User roles",
          optionsTitle: "Selected options",
          
          roles: {
            essential: {
              name: "Essential",
              price: "€19"
            },
            analyst: {
              name: "Analyst",
              price: "€399"
            },
            developer: {
              name: "Developer",
              price: "€1,499"
            }
          },
          
          options: {
            annual: "Annual Offer (-20%)",
            api: {
              name: "AI API Access",
              price: "€499"
            },
            customDoc: {
              name: "Custom Documentation",
              price: "€1,000"
            }
          }
        }
      },
      
      // Step 3: Information
      information: {
        title: "Your information",
        subtitle: "Complete your profile to finalize the subscription",
        
        personal: {
          title: "Personal information",
          fullName: "Full name *",
          email: "Professional email *",
          password: "Password *",
          confirmPassword: "Confirm password *",
          phone: "Phone",
          position: "Position"
        },
        
        company: {
          title: "Company information",
          companyName: "Company name *",
          country: "Country *",
          size: "Company size",
          website: "Website *"
        },
        
        sage: {
          title: "Sage X3 Configuration",
          version: "Sage X3 version *",
          challenges: "Challenges and suggestions"
        }
      },
      
      // Step 4: Summary
      summary: {
        title: "Subscription summary",
        subtitle: "Review details before finalizing",
        
        planDetails: "Plan details",
        userInfo: "User information",
        companyInfo: "Company information",
        
        monthlyTotal: "Monthly total",
        yearlyTotal: "Annual total (with -20%)",
        
        finalizeButton: "Create account and finalize"
      },
      
      // Common
      next: "Next",
      previous: "Previous",
      backToHome: "Back to home",
      perMonth: "per month",
      users: "users",
      
      // Countries
      countries: [
        "France", "Belgium", "Switzerland", "Luxembourg", "Canada",
        "Morocco", "Tunisia", "Algeria", "Germany", "Spain",
        "Italy", "Portugal", "Netherlands", "United Kingdom", "United States", "Other"
      ],
      
      // Company sizes
      companySizes: [
        "1-10 employees",
        "11-50 employees",
        "51-200 employees", 
        "201-500 employees",
        "500+ employees"
      ],
      
      // Sage versions
      sageVersions: [
        "Sage X3 V12",
        "Sage X3 V11",
        "Sage X3 V10", 
        "Sage X3 V9",
        "Other"
      ]
    }
  };

  const currentTexts = texts[i18n.language as keyof typeof texts] || texts.en;

  // Calculation functions
  const calculateEnterpriseMonthly = () => {
    let total = 0;
    total += formData.essentialUsers * 19;
    total += formData.analystUsers * 399;
    total += formData.developerUsers * 1499;
    
    if (formData.apiAccess) total += 499;
    if (formData.customDoc) total += 1000;
    
    return total;
  };

  const calculateYearly = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.8);
  };

  const getCurrentMonthlyPrice = () => {
    return formData.selectedPlan === 'starter' 
      ? 9 
      : calculateEnterpriseMonthly();
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = (): boolean => {
    setError(null);

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

    if (!formData.companyName || !formData.website || !formData.companyCountry || !formData.sageX3Version) {
      setError('Veuillez remplir tous les champs obligatoires de l\'entreprise.');
      return false;
    }

    return true;
  };

  const handleFinalize = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Générer un domaine basé sur le site web
      const domain = formData.website 
        ? formData.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
        : formData.email.split('@')[1];

      // Préparer les métadonnées utilisateur complètes avec TOUTES les données
      const userMetadata = {
        // Informations personnelles
        fullName: formData.fullName,
        position: formData.position,
        phone: formData.phone,
        
        // Informations entreprise
        companyName: formData.companyName,
        companyCountry: formData.companyCountry,
        companyDomain: domain,
        companySize: formData.companySize,
        website: formData.website,
        
        // Configuration Sage X3
        sageX3Version: formData.sageX3Version,
        challengesAndSuggestions: formData.challenges,
        
        // Configuration du plan et tarification
        selectedPlan: formData.selectedPlan,
        essentialUsers: formData.essentialUsers,
        analystUsers: formData.analystUsers,
        developerUsers: formData.developerUsers,
        isAnnual: formData.isAnnual,
        apiAccess: formData.apiAccess,
        customDoc: formData.customDoc,
        
        // Calculs tarifaires
        monthlyPrice: getCurrentMonthlyPrice(),
        yearlyPrice: formData.isAnnual ? calculateYearly(getCurrentMonthlyPrice()) : getCurrentMonthlyPrice() * 12,
        
        // Rôle par défaut
        role: 'Administrateur'
      };

      console.log('Données d\'inscription complètes:', userMetadata);

      // Procéder à l'inscription Supabase avec toutes les métadonnées
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm-email`,
          data: userMetadata
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
      
      // Rediriger vers une page de confirmation après 3 secondes
      setTimeout(() => {
        navigate('/confirm-email', { 
          state: { 
            email: formData.email,
            subscriptionData: formData,
            registrationComplete: true
          }
        });
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      setError('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            step <= currentStep 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'border-gray-300 text-gray-400'
          }`}>
            {step < currentStep ? (
              <Check className="h-5 w-5" />
            ) : (
              <span className="text-sm font-medium">{step}</span>
            )}
          </div>
          {step < 4 && (
            <div className={`w-16 h-0.5 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStepLabels = () => (
    <div className="flex justify-center mb-8">
      <div className="grid grid-cols-4 gap-8 text-center">
        {Object.values(currentTexts.steps).map((label, index) => (
          <div key={index} className={`text-sm ${
            index + 1 <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
          }`}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {currentTexts.planSelection.title}
        </h2>
        <p className="text-gray-600">
          {currentTexts.planSelection.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Starter Plan */}
        <div 
          className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
            formData.selectedPlan === 'starter' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setFormData(prev => ({ ...prev, selectedPlan: 'starter' }))}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {currentTexts.planSelection.starter.name}
              </h3>
              <p className="text-sm text-gray-600">
                {currentTexts.planSelection.starter.description}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {currentTexts.planSelection.starter.price}
            </div>
          </div>

          <div className="space-y-2">
            {currentTexts.planSelection.starter.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Plan */}
        <div 
          className={`p-6 rounded-xl border-2 cursor-pointer transition-all relative ${
            formData.selectedPlan === 'enterprise' 
              ? 'border-yellow-500 bg-yellow-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setFormData(prev => ({ ...prev, selectedPlan: 'enterprise' }))}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
              Recommandé
            </span>
          </div>

          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {currentTexts.planSelection.enterprise.name}
              </h3>
              <p className="text-sm text-gray-600">
                {currentTexts.planSelection.enterprise.description}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-lg text-gray-700 mb-2">
              Configuration personnalisée
            </div>
            <div className="space-y-1 text-sm">
              <div>• {formData.essentialUsers} utilisateurs Essentiel</div>
              <div>• {formData.analystUsers} utilisateurs Analyste</div>
              <div>• {formData.developerUsers} utilisateurs Développeur</div>
              {formData.isAnnual && <div>• Offre annuelle (-20%)</div>}
              {formData.apiAccess && <div>• Accès API IA</div>}
              {formData.customDoc && <div>• Documentation personnalisée</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {currentTexts.configuration.title}
        </h2>
        <p className="text-gray-600">
          {currentTexts.configuration.subtitle}
        </p>
      </div>

      {formData.selectedPlan === 'starter' ? (
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Plan Starter
            </h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">9€</div>
            <div className="text-gray-600 mb-4">par mois</div>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• 1 compte utilisateur</div>
              <div>• 100 000 tokens mensuels</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configuration Entreprise
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Rôles utilisateurs :</h4>
                <div className="space-y-2 text-sm">
                  {formData.essentialUsers > 0 && (
                    <div className="flex justify-between">
                      <span>Utilisateurs Essentiel :</span>
                      <span>{formData.essentialUsers} × 19€</span>
                    </div>
                  )}
                  {formData.analystUsers > 0 && (
                    <div className="flex justify-between">
                      <span>Utilisateurs Analyste :</span>
                      <span>{formData.analystUsers} × 399€</span>
                    </div>
                  )}
                  {formData.developerUsers > 0 && (
                    <div className="flex justify-between">
                      <span>Utilisateurs Développeur :</span>
                      <span>{formData.developerUsers} × 1 499€</span>
                    </div>
                  )}
                </div>
              </div>

              {(formData.isAnnual || formData.apiAccess || formData.customDoc) && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Options :</h4>
                  <div className="space-y-2 text-sm">
                    {formData.isAnnual && (
                      <div className="flex justify-between">
                        <span>Offre Annuelle :</span>
                        <span className="text-green-600">-20%</span>
                      </div>
                    )}
                    {formData.apiAccess && (
                      <div className="flex justify-between">
                        <span>Accès API IA :</span>
                        <span>499€</span>
                      </div>
                    )}
                    {formData.customDoc && (
                      <div className="flex justify-between">
                        <span>Documentation personnalisée :</span>
                        <span>1 000€</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <hr />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total {formData.isAnnual ? 'annuel' : 'mensuel'} :</span>
                <span className="text-blue-600">
                  {formData.isAnnual 
                    ? calculateYearly(calculateEnterpriseMonthly()).toLocaleString()
                    : calculateEnterpriseMonthly().toLocaleString()
                  }€
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {currentTexts.information.title}
        </h2>
        <p className="text-gray-600">
          {currentTexts.information.subtitle}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            {currentTexts.information.personal.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.personal.fullName}
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.personal.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.personal.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.personal.confirmPassword}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.personal.phone}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.personal.position}
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-blue-600" />
            {currentTexts.information.company.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.company.companyName}
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.company.country}
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="companyCountry"
                  value={formData.companyCountry}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Sélectionner un pays</option>
                  {currentTexts.countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.company.size}
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner</option>
                  {currentTexts.companySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.company.website}
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://exemple.com"
                required
              />
            </div>
          </div>
        </div>

        {/* Sage X3 Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            {currentTexts.information.sage.title}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.sage.version}
              </label>
              <select
                name="sageX3Version"
                value={formData.sageX3Version}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Sélectionner une version</option>
                {currentTexts.sageVersions.map(version => (
                  <option key={version} value={version}>{version}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {currentTexts.information.sage.challenges}
              </label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Décrivez vos principaux défis avec Sage X3..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const monthlyPrice = getCurrentMonthlyPrice();
    const yearlyPrice = formData.isAnnual ? calculateYearly(monthlyPrice) : monthlyPrice * 12;

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentTexts.summary.title}
          </h2>
          <p className="text-gray-600">
            {currentTexts.summary.subtitle}
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Plan Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              {currentTexts.summary.planDetails}
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan sélectionné :</span>
                <span className="font-medium">
                  {formData.selectedPlan === 'starter' 
                    ? currentTexts.planSelection.starter.name
                    : currentTexts.planSelection.enterprise.name
                  }
                </span>
              </div>

              {formData.selectedPlan === 'enterprise' && (
                <>
                  {formData.essentialUsers > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Utilisateurs Essentiel :</span>
                      <span className="font-medium">{formData.essentialUsers} × 19€</span>
                    </div>
                  )}
                  {formData.analystUsers > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Utilisateurs Analyste :</span>
                      <span className="font-medium">{formData.analystUsers} × 399€</span>
                    </div>
                  )}
                  {formData.developerUsers > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Utilisateurs Développeur :</span>
                      <span className="font-medium">{formData.developerUsers} × 1 499€</span>
                    </div>
                  )}
                  {formData.apiAccess && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accès API :</span>
                      <span className="font-medium">499€</span>
                    </div>
                  )}
                  {formData.customDoc && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Documentation personnalisée :</span>
                      <span className="font-medium">1 000€</span>
                    </div>
                  )}
                </>
              )}

              <hr className="my-4" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>{formData.isAnnual ? 'Total annuel' : 'Total mensuel'} :</span>
                <span className="text-blue-600">
                  {formData.isAnnual 
                    ? yearlyPrice.toLocaleString()
                    : monthlyPrice.toLocaleString()
                  }€
                </span>
              </div>
              
              {formData.isAnnual && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Économie annuelle :</span>
                  <span>{((monthlyPrice * 12) - yearlyPrice).toLocaleString()}€</span>
                </div>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              {currentTexts.summary.userInfo}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nom :</span>
                <span className="ml-2 font-medium">{formData.fullName}</span>
              </div>
              <div>
                <span className="text-gray-600">Email :</span>
                <span className="ml-2 font-medium">{formData.email}</span>
              </div>
              {formData.phone && (
                <div>
                  <span className="text-gray-600">Téléphone :</span>
                  <span className="ml-2 font-medium">{formData.phone}</span>
                </div>
              )}
              {formData.position && (
                <div>
                  <span className="text-gray-600">Poste :</span>
                  <span className="ml-2 font-medium">{formData.position}</span>
                </div>
              )}
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              {currentTexts.summary.companyInfo}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Entreprise :</span>
                <span className="ml-2 font-medium">{formData.companyName}</span>
              </div>
              <div>
                <span className="text-gray-600">Pays :</span>
                <span className="ml-2 font-medium">{formData.companyCountry}</span>
              </div>
              {formData.companySize && (
                <div>
                  <span className="text-gray-600">Taille :</span>
                  <span className="ml-2 font-medium">{formData.companySize}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">Site web :</span>
                <span className="ml-2 font-medium">{formData.website}</span>
              </div>
              <div>
                <span className="text-gray-600">Sage X3 :</span>
                <span className="ml-2 font-medium">{formData.sageX3Version}</span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Finalize Button */}
          <button
            onClick={handleFinalize}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Création du compte en cours...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {currentTexts.summary.finalizeButton}
              </div>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{currentTexts.backToHome}</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">{currentTexts.title}</h1>
              <p className="text-gray-600">{currentTexts.subtitle}</p>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}
        {renderStepLabels()}

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between items-center mt-12 max-w-4xl mx-auto">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{currentTexts.previous}</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>{currentTexts.next}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
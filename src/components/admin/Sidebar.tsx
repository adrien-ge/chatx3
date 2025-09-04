import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  Users, 
  CheckSquare, 
  Code, 
  MessageCircle, 
  Settings,
  LogOut,
  Home,
  Languages,
  Building,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import { companiesService, Company } from '../../lib/database';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, user }) => {
  const { t } = useTranslation();
  const { isSuperAdmin, appUser, selectedCompanyId, currentCompany, switchCompany, signOut } = useAuth();
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [isCompanySelectorOpen, setIsCompanySelectorOpen] = React.useState(false);
  const [loadingCompanies, setLoadingCompanies] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    if (isSuperAdmin) {
      loadCompanies();
    }
  }, [isSuperAdmin]);

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const { data, error } = await companiesService.getAll();
      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      console.error('Error loading companies:', err);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleCompanySelect = (company: Company) => {
    switchCompany(company.id);
    setIsCompanySelectorOpen(false);
  };

  const handleExitCompanyMode = () => {
    localStorage.removeItem('selected_company_id');
    window.location.reload();
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Éviter les clics multiples
    
    setIsLoggingOut(true);
    try {
      console.log('Starting logout process from sidebar...');
      
      // Utiliser la fonction signOut du contexte d'authentification
      await signOut();
      
      // Forcer le rechargement complet de la page vers l'accueil
      window.location.replace('/');
      
    } catch (error) {
      console.error('Unexpected logout error:', error);
      // En cas d'erreur, forcer la redirection
      window.location.replace('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    {
      id: 'assistant',
      label: 'Assistant IA',
      icon: MessageCircle,
      color: 'text-indigo-600'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 'approval',
      label: 'Approbation',
      icon: CheckSquare,
      color: 'text-orange-600'
    },
    {
      id: 'developers',
      label: 'Développeurs',
      icon: Code,
      color: 'text-purple-600'
    },
    {
      id: 'administration',
      label: 'Administration',
      icon: Settings,
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Intell X3</h2>
          </div>
        </div>

        {/* Affichage du nom de la compagnie ou sélecteur pour Super Admin */}
        {isSuperAdmin ? (
          selectedCompanyId ? (
            // Mode entreprise sélectionnée
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <Building className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-blue-900 truncate">
                      {currentCompany?.name || 'Entreprise'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExitCompanyMode}
                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                  title="Retour au mode Super Admin"
                >
                  <ArrowLeft className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            // Sélecteur de compagnie
            <div className="relative">
              <button
                onClick={() => setIsCompanySelectorOpen(!isCompanySelectorOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={loadingCompanies}
              >
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {loadingCompanies ? 'Chargement...' : 'Sélectionner entreprise'}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>

              {isCompanySelectorOpen && (
                <>
                  {/* Overlay */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsCompanySelectorOpen(false)}
                  />
                  
                  {/* Dropdown */}
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {companies.length === 0 ? (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        Aucune entreprise
                      </div>
                    ) : (
                      companies.map((company) => (
                        <button
                          key={company.id}
                          onClick={() => handleCompanySelect(company)}
                          className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            <Building className="h-3 w-3 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {company.name}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )
        ) : (
          // Affichage simple du nom de la compagnie pour les utilisateurs normaux
          currentCompany && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary-100 rounded flex items-center justify-center">
                  <Building className="h-3 w-3 text-primary-600" />
                </div>
                <p className="text-sm font-medium text-primary-900 truncate">
                  {currentCompany.name}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Language Switcher */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-center">
          <LanguageSwitcher />
        </div>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-medium text-sm">
              {user?.email?.[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {appUser?.full_name || user?.user_metadata?.full_name || user?.email}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            {appUser?.role && (
              <p className="text-xs text-blue-600 font-medium">{appUser.role}</p>
            )}
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">
            {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
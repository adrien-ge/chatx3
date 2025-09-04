import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Globe,
  Building,
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  Crown,
  Code,
  Calendar,
  Activity,
  LogIn
} from 'lucide-react';
import { companiesService, statsService, usersService, Company, CompanyFormData } from '../../lib/database';
import { useAuth } from '../../contexts/AuthContext';

interface CompanyStats {
  total: number;
  active: number;
  inactive: number;
  totalUsers: number;
  totalAdmins: number;
  totalDevelopers: number;
}

const Administration: React.FC = () => {
  const { isSuperAdmin, selectedCompanyId, switchCompany, currentCompany } = useAuth();
  const [activeTab, setActiveTab] = useState<'settings' | 'company' | 'companies'>('settings');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    enableDailyEmailSummary: true,
    enableAnalytics: true,
    language: 'fr'
  });

  const [companyForm, setCompanyForm] = useState<CompanyFormData>({
    name: '',
    domain: '',
    sage_x3_version: 'X3 V12',
    sage_x3_modules: [],
    max_users: 10,
    max_admins: 2,
    max_developers: 1,
    ia_chat_name: 'X3 Assistant',
    contract_start_date: null,
    contract_end_date: null,
    is_active: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const sageVersions = ['X3 V11', 'X3 V12', 'X3 V13'];
  const availableModules = [
    'Ventes',
    'Achats', 
    'Comptabilité',
    'Stock',
    'Production',
    'CRM',
    'Paie',
    'Immobilisations',
    'Contrôle de gestion',
    'Business Intelligence'
  ];

  useEffect(() => {
    if (activeTab === 'companies' && isSuperAdmin) {
      loadCompanies();
      loadStats();
    } else if (activeTab === 'company' && currentCompany) {
      loadCurrentCompanyData();
    }
  }, [activeTab, isSuperAdmin, currentCompany]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await companiesService.getAll();
      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des entreprises');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentCompanyData = () => {
    if (currentCompany) {
      setCompanyForm({
        name: currentCompany.name,
        domain: currentCompany.domain,
        sage_x3_version: currentCompany.sage_x3_version,
        sage_x3_modules: currentCompany.sage_x3_modules,
        max_users: currentCompany.max_users,
        max_admins: currentCompany.max_admins,
        max_developers: currentCompany.max_developers,
        ia_chat_name: currentCompany.ia_chat_name,
        contract_start_date: currentCompany.contract_start_date,
        contract_end_date: currentCompany.contract_end_date,
        is_active: currentCompany.is_active
      });
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await statsService.getCompanyStats();
      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1500);
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Vérifier si le domaine existe déjà
      const { exists, error: checkError } = await companiesService.checkDomainExists(
        companyForm.domain, 
        editingCompany?.id || currentCompany?.id
      );
      
      if (checkError) throw checkError;
      if (exists) {
        setError('Ce domaine est déjà utilisé par une autre entreprise.');
        setLoading(false);
        return;
      }

      const companyId = editingCompany?.id || currentCompany?.id;
      
      if (companyId) {
        // Mise à jour
        const { data, error } = await companiesService.update(companyId, companyForm);
        if (error) throw error;
        setSuccess('Entreprise mise à jour avec succès');
        
        // Recharger les données de l'entreprise courante
        if (currentCompany && companyId === currentCompany.id) {
          window.location.reload(); // Recharger pour mettre à jour le contexte
        }
      } else {
        // Création (seulement pour super admin)
        const { data, error } = await companiesService.create(companyForm);
        if (error) throw error;
        setSuccess('Entreprise créée avec succès');
      }

      if (isSuperAdmin) {
        await loadCompanies();
        await loadStats();
      }
      handleCancelCompanyForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setCompanyForm({
      name: company.name,
      domain: company.domain,
      sage_x3_version: company.sage_x3_version,
      sage_x3_modules: company.sage_x3_modules,
      max_users: company.max_users,
      max_admins: company.max_admins,
      max_developers: company.max_developers,
      ia_chat_name: company.ia_chat_name,
      contract_start_date: company.contract_start_date,
      contract_end_date: company.contract_end_date,
      is_active: company.is_active
    });
    setShowCompanyForm(true);
  };

  const handleDeleteCompany = async (company: Company) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'entreprise "${company.name}" ?`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await companiesService.delete(company.id);
      if (error) throw error;
      
      setSuccess('Entreprise supprimée avec succès');
      await loadCompanies();
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToCompany = (company: Company) => {
    switchCompany(company.id);
    setSuccess(`Connecté à l'entreprise ${company.name}`);
  };

  const handleCancelCompanyForm = () => {
    setShowCompanyForm(false);
    setEditingCompany(null);
    setCompanyForm({
      name: '',
      domain: '',
      sage_x3_version: 'X3 V12',
      sage_x3_modules: [],
      max_users: 10,
      max_admins: 2,
      max_developers: 1,
      ia_chat_name: 'X3 Assistant',
      contract_start_date: null,
      contract_end_date: null,
      is_active: true
    });
    setError(null);
    setSuccess(null);
  };

  const handleModuleToggle = (module: string) => {
    setCompanyForm(prev => ({
      ...prev,
      sage_x3_modules: prev.sage_x3_modules.includes(module)
        ? prev.sage_x3_modules.filter(m => m !== module)
        : [...prev.sage_x3_modules, module]
    }));
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
        <p className="text-gray-600">
          {isSuperAdmin 
            ? 'Configurez et gérez votre système Intell X3 - Mode Super Administrateur'
            : 'Configurez et gérez votre système Intell X3'
          }
        </p>
        {selectedCompanyId && (
          <div className="mt-2 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <Building className="h-4 w-4 mr-1" />
            Entreprise sélectionnée: {companies.find(c => c.id === selectedCompanyId)?.name || currentCompany?.name || 'Chargement...'}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Paramètres Généraux
        </button>
        
        {/* Onglet Entreprise pour tous les utilisateurs */}
        {currentCompany && (
          <button
            onClick={() => setActiveTab('company')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'company'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building className="h-4 w-4 inline mr-2" />
            Mon Entreprise
          </button>
        )}
        
        {/* Onglet Gestion des Entreprises pour Super Admin uniquement */}
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'companies'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building className="h-4 w-4 inline mr-2" />
            Gestion des Entreprises
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 flex items-start space-x-2 text-red-600 text-sm bg-red-50 p-4 rounded-md border border-red-200">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={clearMessages} className="ml-auto text-red-400 hover:text-red-600">×</button>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-start space-x-2 text-green-600 text-sm bg-green-50 p-4 rounded-md border border-green-200">
          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
          <button onClick={clearMessages} className="ml-auto text-green-400 hover:text-green-600">×</button>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">Paramètres Généraux</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue par défaut
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">Paramètres Système</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email récapitulatif quotidien</h4>
                  <p className="text-sm text-gray-500">Recevoir un résumé quotidien des activités</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableDailyEmailSummary}
                    onChange={(e) => setSettings({...settings, enableDailyEmailSummary: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Analytics</h4>
                  <p className="text-sm text-gray-500">Collecter les données d'utilisation</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableAnalytics}
                    onChange={(e) => setSettings({...settings, enableAnalytics: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Configuration Tips */}
          <div className="lg:col-span-2 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Conseils de configuration</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong>Email récapitulatif :</strong> Activez cette option pour recevoir un résumé quotidien des interactions et des performances de votre système.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  <strong>Analytics :</strong> Les données collectées nous aident à améliorer le système et à vous fournir des insights sur l'utilisation.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="lg:col-span-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {saveStatus === 'success' && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">Paramètres sauvegardés avec succès</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-red-600 font-medium">Erreur lors de la sauvegarde</span>
                </>
              )}
            </div>
            
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder les paramètres</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Onglet Mon Entreprise */}
      {activeTab === 'company' && currentCompany && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Building className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Informations de l'entreprise</h2>
              </div>
              <button
                onClick={() => setShowCompanyForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Modifier</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
                <p className="text-gray-900 font-medium">{currentCompany.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domaine</label>
                <p className="text-gray-900">{currentCompany.domain}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version Sage X3</label>
                <p className="text-gray-900">{currentCompany.sage_x3_version}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du chat IA</label>
                <p className="text-gray-900">{currentCompany.ia_chat_name}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Modules Sage X3</label>
                <div className="flex flex-wrap gap-2">
                  {currentCompany.sage_x3_modules.map((module, index) => (
                    <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                      {module}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateurs maximum</label>
                <p className="text-gray-900">{currentCompany.max_users}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Administrateurs maximum</label>
                <p className="text-gray-900">{currentCompany.max_admins}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Développeurs maximum</label>
                <p className="text-gray-900">{currentCompany.max_developers}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  currentCompany.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentCompany.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Gestion des Entreprises (Super Admin) */}
      {activeTab === 'companies' && isSuperAdmin && (
        <div className="space-y-6">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">{stats.total}</span>
                </div>
                <p className="text-sm text-gray-600">Total entreprises</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">{stats.active}</span>
                </div>
                <p className="text-sm text-gray-600">Actives</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">{stats.totalUsers}</span>
                </div>
                <p className="text-sm text-gray-600">Utilisateurs max</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Crown className="h-5 w-5 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">{stats.totalAdmins}</span>
                </div>
                <p className="text-sm text-gray-600">Admins max</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Code className="h-5 w-5 text-indigo-600" />
                  <span className="text-2xl font-bold text-indigo-600">{stats.totalDevelopers}</span>
                </div>
                <p className="text-sm text-gray-600">Développeurs max</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">{stats.inactive}</span>
                </div>
                <p className="text-sm text-gray-600">Inactives</p>
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              onClick={() => setShowCompanyForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter une entreprise</span>
            </button>
          </div>

          {/* Companies Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Entreprise</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Version</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Limites</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Contrat</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Statut</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{company.name}</p>
                          <p className="text-sm text-gray-500">{company.domain}</p>
                          <p className="text-xs text-gray-400">{company.ia_chat_name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {company.sage_x3_version}
                        </span>
                        <div className="mt-1">
                          <p className="text-xs text-gray-500">{company.sage_x3_modules.length} modules</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span>{company.max_users} utilisateurs</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Crown className="h-3 w-3 text-gray-400" />
                            <span>{company.max_admins} admins</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Code className="h-3 w-3 text-gray-400" />
                            <span>{company.max_developers} dev</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          {company.contract_start_date && company.contract_end_date ? (
                            <>
                              <div className="flex items-center space-x-1 text-gray-600">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(company.contract_start_date).toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                au {new Date(company.contract_end_date).toLocaleDateString('fr-FR')}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400">Non défini</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          company.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {company.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSwitchToCompany(company)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Se connecter à cette entreprise"
                          >
                            <LogIn className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditCompany(company)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(company)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise trouvée</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Aucune entreprise ne correspond à votre recherche.' : 'Commencez par ajouter votre première entreprise.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Company Form Modal */}
      {showCompanyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCompany ? 'Modifier l\'entreprise' : 
                 currentCompany && activeTab === 'company' ? 'Modifier mon entreprise' :
                 'Ajouter une entreprise'}
              </h3>
            </div>
            
            <form onSubmit={handleCompanySubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domaine *
                  </label>
                  <input
                    type="text"
                    value={companyForm.domain}
                    onChange={(e) => setCompanyForm({...companyForm, domain: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="exemple.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version Sage X3 *
                  </label>
                  <select
                    value={companyForm.sage_x3_version}
                    onChange={(e) => setCompanyForm({...companyForm, sage_x3_version: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    {sageVersions.map(version => (
                      <option key={version} value={version}>{version}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du chat IA
                  </label>
                  <input
                    type="text"
                    value={companyForm.ia_chat_name}
                    onChange={(e) => setCompanyForm({...companyForm, ia_chat_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Début de contrat
                  </label>
                  <input
                    type="date"
                    value={companyForm.contract_start_date || ''}
                    onChange={(e) => setCompanyForm({...companyForm, contract_start_date: e.target.value || null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fin de contrat
                  </label>
                  <input
                    type="date"
                    value={companyForm.contract_end_date || ''}
                    onChange={(e) => setCompanyForm({...companyForm, contract_end_date: e.target.value || null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max utilisateurs
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={companyForm.max_users}
                    onChange={(e) => setCompanyForm({...companyForm, max_users: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max administrateurs
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={companyForm.max_admins}
                    onChange={(e) => setCompanyForm({...companyForm, max_admins: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max développeurs
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={companyForm.max_developers}
                    onChange={(e) => setCompanyForm({...companyForm, max_developers: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modules Sage X3
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableModules.map(module => (
                    <label key={module} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={companyForm.sage_x3_modules.includes(module)}
                        onChange={() => handleModuleToggle(module)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{module}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={companyForm.is_active}
                  onChange={(e) => setCompanyForm({...companyForm, is_active: e.target.checked})}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Entreprise active
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelCompanyForm}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Sauvegarde...' : editingCompany || (currentCompany && activeTab === 'company') ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administration;
import { supabase } from './supabase';
import { webhookService, WebhookMessageData } from './webhook';

export interface Company {
  id: string;
  name: string;
  domain: string;
  sage_x3_version: string;
  sage_x3_modules: string[];
  max_users: number;
  max_admins: number;
  max_developers: number;
  ia_chat_name: string;
  contract_start_date: string | null;
  contract_end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  company_id: string | null;
  role: string;
  status: string;
  created_at: string;
  company?: Company;
}

export interface CompanyFormData {
  name: string;
  domain: string;
  sage_x3_version: string;
  sage_x3_modules: string[];
  max_users: number;
  max_admins: number;
  max_developers: number;
  ia_chat_name: string;
  contract_start_date: string | null;
  contract_end_date: string | null;
  is_active: boolean;
}

// Helper function to convert empty strings to null for date fields
const sanitizeDateFields = (data: Partial<CompanyFormData>): Partial<CompanyFormData> => {
  const sanitized = { ...data };
  
  if (sanitized.contract_start_date === '') {
    sanitized.contract_start_date = null;
  }
  
  if (sanitized.contract_end_date === '') {
    sanitized.contract_end_date = null;
  }
  
  return sanitized;
};

// Fonctions pour gérer les entreprises
export const companiesService = {
  // Récupérer toutes les entreprises (pour super admin)
  async getAll(): Promise<{ data: Company[] | null; error: any }> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
    
    return { data, error };
  },

  // Récupérer l'entreprise de l'utilisateur connecté
  async getUserCompany(): Promise<{ data: Company | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: 'No authenticated user' };
    }

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', user.user_metadata?.company_id)
      .single();
    
    return { data, error };
  },

  // Récupérer une entreprise par ID
  async getById(id: string): Promise<{ data: Company | null; error: any }> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  // Créer une nouvelle entreprise
  async create(companyData: CompanyFormData): Promise<{ data: Company | null; error: any }> {
    const sanitizedData = sanitizeDateFields(companyData);
    
    const { data, error } = await supabase
      .from('companies')
      .insert([sanitizedData])
      .select()
      .single();
    
    return { data, error };
  },

  // Mettre à jour une entreprise
  async update(id: string, companyData: Partial<CompanyFormData>): Promise<{ data: Company | null; error: any }> {
    const sanitizedData = sanitizeDateFields(companyData);
    
    const { data, error } = await supabase
      .from('companies')
      .update(sanitizedData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  // Supprimer une entreprise
  async delete(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  // Vérifier si un domaine existe déjà
  async checkDomainExists(domain: string, excludeId?: string): Promise<{ exists: boolean; error: any }> {
    let query = supabase
      .from('companies')
      .select('id')
      .eq('domain', domain);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    return { exists: data && data.length > 0, error };
  }
};

// Fonctions pour gérer les utilisateurs
export const usersService = {
  // Récupérer tous les utilisateurs (avec leur compagnie)
  async getAll(): Promise<{ data: User[] | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        company:companies(*)
      `)
      .order('full_name');
    
    return { data, error };
  },

  // Récupérer les utilisateurs d'une compagnie
  async getByCompany(companyId: string): Promise<{ data: User[] | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('company_id', companyId)
      .order('full_name');
    
    return { data, error };
  },

  // Récupérer l'utilisateur connecté avec sa compagnie
  async getCurrentUser(): Promise<{ data: User | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'No authenticated user' };
      }

      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('id', user.id)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // Utilisateur n'existe pas dans la table users, le créer
        console.log('User not found in users table, creating...');
        
        const newUser = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || null,
          role: 'Support',
          status: 'En attente'
        };

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert([newUser])
          .select(`
            *,
            company:companies(*)
          `)
          .maybeSingle();

        if (createError) {
          return { data: null, error: createError };
        }

        if (!createdUser) {
          return { 
            data: null, 
            error: 'User was created but could not be retrieved. This may be due to Row Level Security policies.' 
          };
        }

        return { data: createdUser, error: null };
      }
      
      return { data, error };
    } catch (err) {
      console.error('Error in getCurrentUser:', err);
      return { data: null, error: err };
    }
  },

  // Vérifier si l'utilisateur est super admin
  async isSuperAdmin(): Promise<{ isSuperAdmin: boolean; error: any }> {
    try {
      const { data, error } = await supabase.rpc('is_super_admin');
      return { isSuperAdmin: data || false, error };
    } catch (err) {
      console.error('Error checking super admin status:', err);
      return { isSuperAdmin: false, error: err };
    }
  },

  // Changer de compagnie (pour super admin)
  async switchToCompany(companyId: string): Promise<{ success: boolean; error: any }> {
    try {
      localStorage.setItem('selected_company_id', companyId);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  },

  // Obtenir la compagnie sélectionnée (pour super admin)
  getSelectedCompany(): string | null {
    try {
      return localStorage.getItem('selected_company_id');
    } catch (error) {
      console.error('Error getting selected company:', error);
      return null;
    }
  }
};

// Fonctions pour les statistiques
export const statsService = {
  // Statistiques générales des entreprises
  async getCompanyStats(): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
      .from('companies')
      .select('is_active, max_users, max_admins, max_developers');
    
    if (error) return { data: null, error };
    
    const stats = {
      total: data.length,
      active: data.filter(c => c.is_active).length,
      inactive: data.filter(c => !c.is_active).length,
      totalUsers: data.reduce((sum, c) => sum + c.max_users, 0),
      totalAdmins: data.reduce((sum, c) => sum + c.max_admins, 0),
      totalDevelopers: data.reduce((sum, c) => sum + c.max_developers, 0)
    };
    
    return { data: stats, error: null };
  },

  // Statistiques d'une compagnie spécifique
  async getCompanyUserStats(companyId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .select('role, status')
      .eq('company_id', companyId);
    
    if (error) return { data: null, error };
    
    const stats = {
      totalUsers: data.length,
      activeUsers: data.filter(u => u.status === 'Actif').length,
      admins: data.filter(u => u.role === 'Administrateur').length,
      developers: data.filter(u => u.role === 'Développeur').length,
      support: data.filter(u => u.role === 'Support').length
    };
    
    return { data: stats, error: null };
  }
};
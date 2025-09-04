import React, { useState } from 'react';
import { Search, Plus, MessageCircle, Clock, CheckCircle, XCircle, AlertTriangle, User, Calendar } from 'lucide-react';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'bug' | 'feature' | 'support' | 'question';
  author: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  messages: number;
}

const TicketsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const tickets: Ticket[] = [
    {
      id: 1,
      title: 'Erreur lors de la validation des commandes',
      description: 'Le système affiche une erreur "Commande non livrable" même quand le client n\'est pas bloqué.',
      status: 'open',
      priority: 'high',
      category: 'bug',
      author: 'Marie Dubois',
      assignedTo: 'Jean Martin',
      createdAt: '2024-01-15 10:30',
      updatedAt: '2024-01-15 14:20',
      messages: 3
    },
    {
      id: 2,
      title: 'Demande d\'amélioration du module de facturation',
      description: 'Possibilité d\'ajouter des champs personnalisés dans les factures pour les besoins spécifiques.',
      status: 'in_progress',
      priority: 'medium',
      category: 'feature',
      author: 'Pierre Durand',
      assignedTo: 'Sophie Laurent',
      createdAt: '2024-01-14 16:45',
      updatedAt: '2024-01-15 09:15',
      messages: 7
    },
    {
      id: 3,
      title: 'Comment configurer les alertes de stock ?',
      description: 'J\'aimerais recevoir des notifications automatiques quand le stock descend en dessous d\'un seuil.',
      status: 'resolved',
      priority: 'low',
      category: 'question',
      author: 'Lucie Martin',
      assignedTo: 'Jean Martin',
      createdAt: '2024-01-13 09:15',
      updatedAt: '2024-01-14 11:30',
      messages: 5
    },
    {
      id: 4,
      title: 'Problème de performance sur les rapports',
      description: 'Les rapports de vente prennent plus de 5 minutes à se générer depuis la dernière mise à jour.',
      status: 'open',
      priority: 'urgent',
      category: 'bug',
      author: 'Thomas Leroy',
      createdAt: '2024-01-15 14:20',
      updatedAt: '2024-01-15 14:20',
      messages: 1
    },
    {
      id: 5,
      title: 'Support pour l\'intégration API externe',
      description: 'Besoin d\'aide pour connecter notre CRM externe avec Sage X3.',
      status: 'in_progress',
      priority: 'medium',
      category: 'support',
      author: 'Anne Rousseau',
      assignedTo: 'Pierre Durand',
      createdAt: '2024-01-12 11:00',
      updatedAt: '2024-01-15 08:45',
      messages: 12
    }
  ];

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Ouvert';
      case 'in_progress':
        return 'En cours';
      case 'resolved':
        return 'Résolu';
      case 'closed':
        return 'Fermé';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'high':
        return 'Haute';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Basse';
      default:
        return priority;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'bug':
        return 'Bug';
      case 'feature':
        return 'Fonctionnalité';
      case 'support':
        return 'Support';
      case 'question':
        return 'Question';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug':
        return 'bg-red-50 text-red-700';
      case 'feature':
        return 'bg-blue-50 text-blue-700';
      case 'support':
        return 'bg-purple-50 text-purple-700';
      case 'question':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const stats = [
    {
      title: 'Tickets ouverts',
      value: tickets.filter(t => t.status === 'open').length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'En cours',
      value: tickets.filter(t => t.status === 'in_progress').length,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Résolus aujourd\'hui',
      value: tickets.filter(t => t.status === 'resolved').length,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Urgents',
      value: tickets.filter(t => t.priority === 'urgent').length,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Tickets</h1>
        <p className="text-gray-600">Suivez et gérez les demandes de support et les signalements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <MessageCircle className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="closed">Fermé</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Toutes les priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>

            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Nouveau ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">#{ticket.id} {ticket.title}</h3>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                    {getPriorityLabel(ticket.priority)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(ticket.category)}`}>
                    {getCategoryLabel(ticket.category)}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Par {ticket.author}</span>
                  </div>
                  {ticket.assignedTo && (
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Assigné à {ticket.assignedTo}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{ticket.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{ticket.messages} message{ticket.messages > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 ml-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(ticket.status)}
                  <span className={`text-sm font-medium ${
                    ticket.status === 'open' ? 'text-blue-600' :
                    ticket.status === 'in_progress' ? 'text-orange-600' :
                    ticket.status === 'resolved' ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Dernière mise à jour: {ticket.updatedAt}
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm text-primary-600 border border-primary-600 rounded hover:bg-primary-50 transition-colors">
                  Voir détails
                </button>
                {ticket.status !== 'closed' && (
                  <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors">
                    Répondre
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun ticket trouvé</h3>
          <p className="text-gray-500">Aucun ticket ne correspond à vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
};

export default TicketsManagement;
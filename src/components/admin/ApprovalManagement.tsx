import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Code, FileText } from 'lucide-react';

const ApprovalManagement: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const approvals = [
    {
      id: 1,
      title: 'Optimisation fonction calcul TVA',
      type: 'code',
      author: 'Jean Martin',
      description: 'Amélioration des performances de calcul de la TVA pour les commandes',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-15 10:30',
      impact: 'Performance +25%'
    },
    {
      id: 2,
      title: 'Nouveau patch validation client',
      type: 'patch',
      author: 'Marie Dubois',
      description: 'Correction du bug de validation des données client',
      status: 'approved',
      priority: 'medium',
      createdAt: '2024-01-14 16:45',
      impact: 'Bug critique résolu'
    },
    {
      id: 3,
      title: 'Mise à jour interface utilisateur',
      type: 'feature',
      author: 'Sophie Laurent',
      description: 'Amélioration de l\'interface de saisie des commandes',
      status: 'rejected',
      priority: 'low',
      createdAt: '2024-01-13 09:15',
      impact: 'UX améliorée'
    },
    {
      id: 4,
      title: 'Fonction export données',
      type: 'code',
      author: 'Pierre Durand',
      description: 'Nouvelle fonction d\'export des données vers Excel',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-15 14:20',
      impact: 'Nouvelle fonctionnalité'
    }
  ];

  const filteredApprovals = filter === 'all' 
    ? approvals 
    : approvals.filter(approval => approval.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <Code className="h-4 w-4 text-purple-500" />;
      case 'patch':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'feature':
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Approbations</h1>
        <p className="text-gray-600">Approuvez ou rejetez les modifications proposées</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'pending', label: 'En attente' },
          { key: 'approved', label: 'Approuvées' },
          { key: 'rejected', label: 'Rejetées' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map((approval) => (
          <div key={approval.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getTypeIcon(approval.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{approval.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(approval.priority)}`}>
                      {approval.priority === 'high' ? 'Haute' : approval.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{approval.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Par {approval.author}</span>
                    <span>•</span>
                    <span>{approval.createdAt}</span>
                    <span>•</span>
                    <span className="text-primary-600 font-medium">{approval.impact}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(approval.status)}
                  <span className={`text-sm font-medium ${
                    approval.status === 'pending' ? 'text-orange-600' :
                    approval.status === 'approved' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {approval.status === 'pending' ? 'En attente' :
                     approval.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                  </span>
                </div>
              </div>
            </div>

            {approval.status === 'pending' && (
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircle className="h-4 w-4" />
                  <span>Approuver</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <XCircle className="h-4 w-4" />
                  <span>Rejeter</span>
                </button>
                <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Voir les détails
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalManagement;
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

const UsersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@company.com',
      role: 'Utilisateur',
      status: 'Actif',
      lastLogin: '2024-01-15 14:30',
      requests: 156
    },
    {
      id: 2,
      name: 'Jean Martin',
      email: 'jean.martin@company.com',
      role: 'Développeur',
      status: 'Actif',
      lastLogin: '2024-01-15 09:15',
      requests: 89
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      email: 'sophie.laurent@company.com',
      role: 'Admin',
      status: 'Actif',
      lastLogin: '2024-01-15 16:45',
      requests: 234
    },
    {
      id: 4,
      name: 'Pierre Durand',
      email: 'pierre.durand@company.com',
      role: 'Utilisateur',
      status: 'Inactif',
      lastLogin: '2024-01-10 11:20',
      requests: 45
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Utilisateurs</h1>
        <p className="text-gray-600">Gérez les utilisateurs et leurs permissions</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Ajouter un utilisateur</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Utilisateur</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Rôle</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Statut</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Dernière connexion</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Requêtes</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'Développeur' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {user.status === 'Actif' ? (
                        <UserCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        user.status === 'Actif' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {user.lastLogin}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-900">{user.requests}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
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
    </div>
  );
};

export default UsersManagement;
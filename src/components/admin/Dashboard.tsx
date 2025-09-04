import React from 'react';
import { BarChart3, Users, MessageCircle, TrendingUp, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Utilisateurs Actifs',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Requêtes IA',
      value: '8,432',
      change: '+23%',
      changeType: 'positive',
      icon: MessageCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Tickets Résolus',
      value: '156',
      change: '+18%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'bg-emerald-500'
    },
    {
      title: 'Problèmes en Cours',
      value: '23',
      change: '-8%',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'bg-orange-500'
    },
    {
      title: 'Suggestions Proposées',
      value: '89',
      change: '+15%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Temps de Réponse',
      value: '1.2s',
      change: '-8%',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-indigo-500'
    }
  ];

  // Données pour l'histogramme des demandes par type
  const requestTypes = [
    { type: 'Problème', count: 45, color: 'bg-red-500', percentage: 35 },
    { type: 'Formation', count: 32, color: 'bg-blue-500', percentage: 25 },
    { type: 'Question', count: 28, color: 'bg-green-500', percentage: 22 },
    { type: 'Suggestion', count: 23, color: 'bg-purple-500', percentage: 18 }
  ];

  // Calcul des dates
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  // Données pour le graphique d'interactions par jour avec des variations plus contrastées
  const dailyInteractions = [
    { day: 1, interactions: 89 },
    { day: 2, interactions: 245 },
    { day: 3, interactions: 156 },
    { day: 4, interactions: 312 },
    { day: 5, interactions: 198 },
    { day: 6, interactions: 67 },
    { day: 7, interactions: 289 },
    { day: 8, interactions: 134 },
    { day: 9, interactions: 356 },
    { day: 10, interactions: 201 },
    { day: 11, interactions: 78 },
    { day: 12, interactions: 298 },
    { day: 13, interactions: 167 },
    { day: 14, interactions: 389 },
    { day: 15, interactions: 145 },
    { day: 16, interactions: 92 },
    { day: 17, interactions: 267 },
    { day: 18, interactions: 178 },
    { day: 19, interactions: 334 },
    { day: 20, interactions: 123 },
    { day: 21, interactions: 298 },
    { day: 22, interactions: 156 },
    { day: 23, interactions: 401 },
    { day: 24, interactions: 189 },
    { day: 25, interactions: 76 },
    { day: 26, interactions: 312 },
    { day: 27, interactions: 234 },
    { day: 28, interactions: 167 },
    { day: 29, interactions: 345 },
    { day: 30, interactions: 198 }
  ];

  const maxInteractions = Math.max(...dailyInteractions.map(d => d.interactions));
  const averageInteractions = Math.round(dailyInteractions.reduce((sum, d) => sum + d.interactions, 0) / dailyInteractions.length);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de votre système Intell X3 sur un mois glissant</p>
      </div>

      {/* Stats Grid - Version ultra compacte pour tenir sur une ligne */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-6 h-6 ${stat.color} rounded flex items-center justify-center`}>
                  <Icon className="h-3 w-3 text-white" />
                </div>
                <span className={`text-xs font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-xs leading-tight">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité Système - Interactions par jour */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Activité Système</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Interactions par jour</span>
            </div>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg p-4 relative">
            {/* Grille de fond */}
            <div className="absolute inset-4 grid grid-rows-4 gap-0 opacity-20">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-b border-gray-300"></div>
              ))}
            </div>
            
            {/* Barres du graphique */}
            <div className="relative h-full flex items-end justify-between gap-1">
              {dailyInteractions.map((data, index) => {
                const heightPercentage = (data.interactions / maxInteractions) * 100;
                const minHeight = 5; // Hauteur minimale en pourcentage
                const finalHeight = Math.max(heightPercentage, minHeight);
                
                return (
                  <div key={index} className="flex flex-col items-center group relative flex-1">
                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      Jour {data.day}: {data.interactions} interactions
                    </div>
                    
                    {/* Barre */}
                    <div 
                      className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-sm hover:from-primary-700 hover:to-primary-500 transition-colors cursor-pointer"
                      style={{ 
                        height: `${finalHeight}%`,
                        minHeight: '8px' // Hauteur minimale absolue
                      }}
                    ></div>
                    
                    {/* Label du jour (affiché tous les 5 jours) */}
                    {(data.day % 5 === 1 || data.day === 30) && (
                      <span className="text-xs text-gray-500 mt-2 font-medium">{data.day}</span>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Légende en bas */}
            <div className="flex justify-between items-center text-xs text-gray-500 mt-4 pt-2 border-t border-gray-200">
              <span className="font-medium">{formatDate(oneMonthAgo)}</span>
              <div className="text-center">
                <span className="font-medium text-primary-600">
                  Moyenne: {averageInteractions} interactions/jour
                </span>
              </div>
              <span className="font-medium">{formatDate(today)}</span>
            </div>
          </div>
        </div>

        {/* Demandes par Type - Histogramme */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Demandes par Type</h2>
          
          <div className="space-y-6">
            {requestTypes.map((type, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${type.color} rounded`}></div>
                    <span className="font-medium text-gray-900">{type.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{type.count}</span>
                    <span className="text-xs text-gray-400">({type.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${type.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${type.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">128</div>
                <div className="text-sm text-gray-500">Total sur la période</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">+15%</div>
                <div className="text-sm text-gray-500">vs la période précédente</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
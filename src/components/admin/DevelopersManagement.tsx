import React, { useState, useEffect } from 'react';
import { Code, Sparkles, FileCode, Zap, ArrowRight, Play, Pause } from 'lucide-react';

const DevelopersManagement: React.FC = () => {
  const [isTyping, setIsTyping] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [displayedCode, setDisplayedCode] = useState<string[]>([]);

  // Code L4G/Sage X3 réaliste pour fichier SPVSOH.src
  const codeLines = [
    "# SPVSOH.src - Gestion des commandes de vente",
    "# Génération automatique par Intell X3 AI",
    "",
    "Local File GESSOH",
    "Local Integer RETOUR, LIGNE",
    "Local Char CLSOH(30), BPSOH(15)",
    "",
    "# Ouverture du fichier des commandes",
    "Open \"SORDER\" Using [F:SOH]",
    "If fstat Then",
    "  Call ERREUR(\"Erreur ouverture SORDER\") From GESECRAN",
    "  End",
    "Endif",
    "",
    "# Lecture des commandes en attente",
    "For [F:SOH] Where [F:SOH]SOHSTA = 2",
    "  # Vérification du stock disponible",
    "  Gosub VERIF_STOCK",
    "  If RETOUR = 0",
    "    # Validation automatique de la commande",
    "    [F:SOH]SOHSTA = 3",
    "    [F:SOH]CREDATTIM = datetime$",
    "    Rewrite [F:SOH]",
    "    Call LOG_VALIDATION([F:SOH]SOHNUM) From GESLOG",
    "  Endif",
    "Next",
    "",
    "$VERIF_STOCK",
    "  RETOUR = 0",
    "  # Contrôle des quantités en stock",
    "  Read [F:ITM]0 = [F:SOH]ITMREF",
    "  If fstat Then",
    "    RETOUR = 1",
    "    Return",
    "  Endif",
    "  # Calcul du stock disponible",
    "  If [F:ITM]PHYSTO < [F:SOH]QTY",
    "    RETOUR = 1",
    "  Endif",
    "Return",
    "",
    "# Fermeture des fichiers",
    "Close Using [F:SOH]",
    "End"
  ];

  useEffect(() => {
    if (!isTyping) return;

    const timer = setInterval(() => {
      if (currentLine < codeLines.length) {
        const line = codeLines[currentLine];
        
        if (currentChar < line.length) {
          setDisplayedCode(prev => {
            const newCode = [...prev];
            if (!newCode[currentLine]) {
              newCode[currentLine] = '';
            }
            newCode[currentLine] = line.substring(0, currentChar + 1);
            return newCode;
          });
          setCurrentChar(prev => prev + 1);
        } else {
          // Ligne terminée, passer à la suivante
          setCurrentLine(prev => prev + 1);
          setCurrentChar(0);
          
          // Petite pause entre les lignes
          setTimeout(() => {}, 100);
        }
      } else {
        // Code terminé, recommencer après une pause
        setTimeout(() => {
          setDisplayedCode([]);
          setCurrentLine(0);
          setCurrentChar(0);
        }, 3000);
      }
    }, 50); // Vitesse de frappe

    return () => clearInterval(timer);
  }, [isTyping, currentLine, currentChar, codeLines]);

  const toggleTyping = () => {
    setIsTyping(!isTyping);
  };

  const restartDemo = () => {
    setDisplayedCode([]);
    setCurrentLine(0);
    setCurrentChar(0);
    setIsTyping(true);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Bientôt disponible
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Développement par <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">IA</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez la révolution du développement Sage X3 avec notre IA qui code automatiquement vos solutions métier
          </p>
        </div>

        {/* Main Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Code Editor Simulation */}
          <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            {/* Editor Header */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <FileCode className="h-4 w-4" />
                    <span className="text-sm font-medium">SPVSOH.src</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleTyping}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title={isTyping ? "Pause" : "Play"}
                  >
                    {isTyping ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={restartDemo}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Restart"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-6 h-96 overflow-y-auto font-mono text-sm">
              {displayedCode.map((line, index) => (
                <div key={index} className="flex items-start space-x-4 min-h-[1.5rem]">
                  <span className="text-gray-500 text-xs w-8 text-right select-none">
                    {line && line.trim() ? index + 1 : ''}
                  </span>
                  <div className="flex-1">
                    <span className={`${
                      line && line.startsWith('#') ? 'text-green-400' :
                      line && (line.includes('Local') || line.includes('For') || line.includes('If') || line.includes('Endif') || line.includes('Next') || line.includes('Return') || line.includes('End')) ? 'text-blue-400' :
                      line && (line.includes('SORDER') || line.includes('SOH') || line.includes('ITM')) ? 'text-yellow-400' :
                      line && line.includes('"') ? 'text-orange-400' :
                      'text-gray-300'
                    }`}>
                      {line || ''}
                    </span>
                    {index === currentLine && currentChar === (codeLines[currentLine]?.length || 0) && isTyping && (
                      <span className="bg-blue-500 text-blue-500 animate-pulse">|</span>
                    )}
                  </div>
                </div>
              ))}
              {currentLine < codeLines.length && isTyping && (
                <div className="flex items-start space-x-4 min-h-[1.5rem]">
                  <span className="text-gray-500 text-xs w-8 text-right select-none">
                    {currentLine + 1}
                  </span>
                  <div className="flex-1">
                    <span className="bg-blue-500 text-blue-500 animate-pulse">|</span>
                  </div>
                </div>
              )}
            </div>

            {/* Status Bar */}
            <div className="bg-gray-800 px-6 py-3 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>L4G/Sage X3</span>
                  <span>•</span>
                  <span>UTF-8</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-green-400" />
                    <span className="text-green-400">IA Active</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Ligne {currentLine + 1}</span>
                  <span>•</span>
                  <span>{displayedCode.reduce((acc, line) => acc + (line?.length || 0), 0)} caractères</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Génération Automatique</h3>
                  <p className="text-gray-600">Code L4G intelligent et optimisé</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Analyse contextuelle</h4>
                    <p className="text-sm text-gray-600">Comprend vos besoins métier et génère le code adapté</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Optimisation automatique</h4>
                    <p className="text-sm text-gray-600">Code optimisé pour les performances Sage X3</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Tests intégrés</h4>
                    <p className="text-sm text-gray-600">Validation automatique et tests de régression</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
              <h3 className="text-xl font-bold mb-4">🚀 Fonctionnalités à venir</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Génération de code L4G à partir de descriptions en langage naturel</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Refactoring automatique et optimisation de code existant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Détection et correction automatique des bugs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Documentation automatique du code généré</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Intégration avec les outils de développement Sage X3</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Développement Rapide</h3>
            <p className="text-gray-600 text-sm">Réduisez le temps de développement de 80% avec notre IA</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCode className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Code de Qualité</h3>
            <p className="text-gray-600 text-sm">Code respectant les meilleures pratiques Sage X3</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">IA Avancée</h3>
            <p className="text-gray-600 text-sm">Intelligence artificielle spécialisée en développement ERP</p>
          </div>
        </div>

        {/* Call to Action - Sans champ email */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Soyez les premiers informés
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Vous serez automatiquement notifié dès que notre module de développement par IA sera disponible
          </p>
          
          <div className="flex justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Me notifier automatiquement
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Nous utiliserons votre adresse email de compte pour vous tenir informé. Pas de spam, juste les mises à jour importantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopersManagement;
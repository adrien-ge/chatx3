import React, { useState, useEffect } from 'react';
import { Check, Calculator, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PricingSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currency = '€';

  // États pour les calculateurs
  const [essentialUsers, setEssentialUsers] = useState(50);
  const [analystUsers, setAnalystUsers] = useState(1);
  const [developerUsers, setDeveloperUsers] = useState(0);
  const [isAnnual, setIsAnnual] = useState(false);
  const [apiAccess, setApiAccess] = useState(false);
  const [customDoc, setCustomDoc] = useState(false);

  // État pour le calculateur d'économies
  const [savingsTickets, setSavingsTickets] = useState(50); // Même valeur que essentialUsers
  const [userModifiedTickets, setUserModifiedTickets] = useState(false);

  // Mettre à jour le nombre de tickets en fonction du nombre d'utilisateurs essentiels
  useEffect(() => {
    if (!userModifiedTickets) {
      setSavingsTickets(essentialUsers);
    }
  }, [essentialUsers, userModifiedTickets]);

  // Fonctions de calcul
  const calculateEnterpriseMonthly = () => {
    let total = 0;
    total += essentialUsers * 19;
    total += analystUsers * 399;
    total += developerUsers * 1499;
    
    if (apiAccess) total += 499;
    if (customDoc) total += 1000;
    
    return total;
  };

  const calculateYearly = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.8); // 20% de réduction
  };

  const calculateSavings = (tickets: number) => {
    const monthly = tickets * 20; // 20€ par ticket selon les nouvelles infos
    const yearly = monthly * 12;
    return { monthly, yearly };
  };

  const savings = calculateSavings(savingsTickets);
  const enterpriseMonthly = calculateEnterpriseMonthly();

  const handlePlanSelect = (plan: string, config?: any) => {
    const planData = {
      plan,
      ...config
    };
    navigate('/subscription', { state: planData });
  };

  const handleTicketsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setSavingsTickets(value);
    setUserModifiedTickets(true);
  };

  const handleEssentialUsersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setEssentialUsers(value);
  };

  const texts = {
    fr: {
      title: "Boostez Sage X3 à l'IA",
      subtitle: "Visualisez vos économies et l'impact réel sur votre productivité. Notre IA adaptée à votre structure, à vos enjeux, à votre rythme.",
      
      // Plans
      starter: {
        name: "Plan Starter",
        description: "Pour consultants et petites équipes",
        price: "9€ / mois",
        features: [
          "1 compte utilisateur",
          "100 000 tokens mensuels",
          "Paiement uniquement à la consommation"
        ],
        roles: [
          "Essentiel",
          "Analyste",
          "Développeur"
        ],
        addons: {
          title: "Packs supplémentaires",
          pack1: "Pack 1 : 1M tokens - 199€",
          pack2: "Pack 2 : 10M tokens - 499€"
        },
        cta: "Choisir Starter"
      },
      
      enterprise: {
        name: "Plan Entreprise",
        description: "Solution intégrée à votre ERP Sage X3",
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
          title: "Options (par entreprise/mois)",
          annual: "Offre Annuelle (-20%)",
          api: {
            name: "Accès API IA",
            price: "499€"
          },
          customDoc: {
            name: "Documentation Personnalisée",
            price: "1 000€"
          }
        },
        intensive: {
          title: "Usage Intensif",
          pack1: "Pack 1 : 1M tokens - 149€",
          pack2: "Pack 2 : 10M tokens - 399€"
        },
        cta: "Configurer Entreprise"
      },
      
      // Calculateur
      calculator: {
        title: "Calculez vos économies",
        subtitle: "Estimez vos économies en réduisant les tickets de support",
        ticketsLabel: "Tickets support par mois",
        monthlySavings: "Économies mensuelles",
        yearlySavings: "Économies annuelles",
        note: "Basé sur un coût moyen de 20€ par ticket",
        benefits: [
          "Une réactivité améliorée",
          "Une formation à la demande", 
          "Des tickets de niveau qualifiés",
          "Des suggestions d'amélioration"
        ]
      },
      
      // Labels
      users: "utilisateurs",
      perMonth: "par mois",
      yearlyPrice: "Prix annuel",
      monthlyEstimate: "Coût mensuel",
      yearlyEstimate: "Coût annuel",
      allFeaturesIncluded: "Toutes fonctionnalités incluses"
    },
    
    en: {
      title: "Boost Sage X3 with AI",
      subtitle: "Visualize your savings and the real impact on your productivity. Our AI adapted to your structure, your challenges, your pace.",
      
      // Plans
      starter: {
        name: "Starter Plan",
        description: "For consultants and small teams",
        price: "€9 / month",
        features: [
          "1 user account",
          "100,000 monthly tokens",
          "Pay only for what you use"
        ],
        roles: [
          "Essential",
          "Analyst",
          "Developer"
        ],
        addons: {
          title: "Additional packs",
          pack1: "Pack 1: 1M tokens - €199",
          pack2: "Pack 2: 10M tokens - €499"
        },
        cta: "Choose Starter"
      },
      
      enterprise: {
        name: "Enterprise Plan",
        description: "Solution integrated with your Sage X3 ERP",
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
          title: "Options (per company/month)",
          annual: "Annual Offer (-20%)",
          api: {
            name: "AI API Access",
            price: "€499"
          },
          customDoc: {
            name: "Custom Documentation",
            price: "€1,000"
          }
        },
        intensive: {
          title: "Intensive Usage",
          pack1: "Pack 1: 1M tokens - €149",
          pack2: "Pack 2: 10M tokens - €399"
        },
        cta: "Configure Enterprise"
      },
      
      // Calculator
      calculator: {
        title: "Calculate your savings",
        subtitle: "Estimate your savings by reducing support tickets",
        ticketsLabel: "Support tickets per month",
        monthlySavings: "Monthly savings",
        yearlySavings: "Annual savings",
        note: "Based on an average cost of €20 per ticket",
        benefits: [
          "Improved responsiveness",
          "On-demand training",
          "Qualified level tickets", 
          "Improvement suggestions"
        ]
      },
      
      // Labels
      users: "users",
      perMonth: "per month",
      yearlyPrice: "Annual price",
      monthlyEstimate: "Monthly cost",
      yearlyEstimate: "Annual cost",
      allFeaturesIncluded: "All features included"
    }
  };

  const currentTexts = texts[i18n.language as keyof typeof texts] || texts.en;

  // Toggle Switch Component
  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  }> = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <section id="pricing" className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {currentTexts.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {currentTexts.subtitle}
          </p>
        </div>

        {/* Grille des offres - 3 colonnes équilibrées */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Plan Starter */}
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{currentTexts.starter.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{currentTexts.starter.description}</p>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">
                    9{currency}
                  </div>
                  <div className="text-gray-400 text-sm">{currentTexts.perMonth}</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-medium text-gray-300 mb-3">{currentTexts.allFeaturesIncluded}</div>
                <div className="space-y-2">
                  {currentTexts.starter.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {currentTexts.starter.roles.map((role, index) => (
                    <div key={`role-${index}`} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 mb-6 text-sm">
                <div className="font-medium text-gray-300 mb-2">{currentTexts.starter.addons.title}</div>
                <div className="text-gray-400 space-y-1 text-xs">
                  <div>{currentTexts.starter.addons.pack1}</div>
                  <div>{currentTexts.starter.addons.pack2}</div>
                  <div>Option API : 499€</div>
                </div>
              </div>

              <button
                onClick={() => handlePlanSelect('starter')}
                className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                {currentTexts.starter.cta}
              </button>
            </div>
          </div>

          {/* Plan Entreprise */}
          <div className="bg-gray-900 rounded-xl shadow-lg border-2 border-blue-500 overflow-hidden relative">
            <div className="bg-blue-500 text-center py-2">
              <span className="text-white font-medium text-sm">RECOMMANDÉ</span>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{currentTexts.enterprise.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{currentTexts.enterprise.description}</p>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">
                    {isAnnual ? calculateYearly(enterpriseMonthly).toLocaleString() : enterpriseMonthly.toLocaleString()}{currency}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {isAnnual ? 'facturé annuellement' : `${currentTexts.perMonth} facturé mensuellement`}
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-green-400 font-medium">
                      Économie de {(enterpriseMonthly * 12 - calculateYearly(enterpriseMonthly)).toLocaleString()}€/an
                    </div>
                  )}
                </div>
              </div>

              {/* Rôles utilisateurs */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-300 text-sm">Rôles utilisateurs :</h4>
                
                {/* Essentiel */}
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-300">{currentTexts.enterprise.roles.essential.name}</span>
                    <span className="text-xs text-gray-400 ml-1">{currentTexts.enterprise.roles.essential.price}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={essentialUsers}
                    onChange={handleEssentialUsersChange}
                    className="w-16 px-2 py-1 text-center border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Analyste */}
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-300">{currentTexts.enterprise.roles.analyst.name}</span>
                    <span className="text-xs text-gray-400 ml-1">{currentTexts.enterprise.roles.analyst.price}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={analystUsers}
                    onChange={(e) => setAnalystUsers(parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-center border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Développeur */}
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-300">{currentTexts.enterprise.roles.developer.name}</span>
                    <span className="text-xs text-gray-400 ml-1">{currentTexts.enterprise.roles.developer.price}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={developerUsers}
                    onChange={(e) => setDeveloperUsers(parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-center border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Options avec toggles */}
              <div className="space-y-2 mb-6">
                <h4 className="font-medium text-gray-300 text-xs">{currentTexts.enterprise.options.title}</h4>
                
                <div className="bg-gray-800 rounded-lg p-3 space-y-2">
                  <ToggleSwitch
                    checked={isAnnual}
                    onChange={setIsAnnual}
                    label={currentTexts.enterprise.options.annual}
                  />
                  
                  <ToggleSwitch
                    checked={apiAccess}
                    onChange={setApiAccess}
                    label={`${currentTexts.enterprise.options.api.name} (${currentTexts.enterprise.options.api.price})`}
                  />
                  
                  <ToggleSwitch
                    checked={customDoc}
                    onChange={setCustomDoc}
                    label={`${currentTexts.enterprise.options.customDoc.name} (${currentTexts.enterprise.options.customDoc.price})`}
                  />
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 mb-6 text-sm">
                <h4 className="font-medium text-gray-300 mb-2">{currentTexts.enterprise.intensive.title}</h4>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>{currentTexts.enterprise.intensive.pack1}</div>
                  <div>{currentTexts.enterprise.intensive.pack2}</div>
                </div>
              </div>

              <button
                onClick={() => handlePlanSelect('enterprise', {
                  essentialUsers,
                  analystUsers,
                  developerUsers,
                  isAnnual,
                  apiAccess,
                  customDoc
                })}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Mettre à niveau
              </button>
            </div>
          </div>

          {/* Calculateur d'économies */}
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {currentTexts.calculator.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {currentTexts.calculator.subtitle}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {currentTexts.calculator.ticketsLabel}
                </label>
                <input
                  type="number"
                  min="1"
                  max="9999"
                  value={savingsTickets}
                  onChange={handleTicketsChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="text-center bg-green-900/30 p-3 rounded-lg border border-green-700">
                  <div className="text-xs text-green-400 mb-1">{currentTexts.calculator.monthlySavings}</div>
                  <div className="text-xl font-bold text-green-400">
                    {savings.monthly.toLocaleString()}{currency}
                  </div>
                </div>

                <div className="text-center bg-green-900/30 p-3 rounded-lg border border-green-700">
                  <div className="text-xs text-green-400 mb-1">{currentTexts.calculator.yearlySavings}</div>
                  <div className="text-xl font-bold text-green-400">
                    {savings.yearly.toLocaleString()}{currency}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-gray-300 mb-3">{currentTexts.allFeaturesIncluded}</div>
              <div className="space-y-2">
                {currentTexts.calculator.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-gray-800 rounded-lg text-xs text-gray-400 border border-gray-700">
              {currentTexts.calculator.note}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
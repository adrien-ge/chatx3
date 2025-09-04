import React from 'react';
import { MessageCircle, GraduationCap, Lightbulb, Wrench, ArrowRight, Target, TrendingUp, Zap, Settings, CheckCircle } from 'lucide-react';
import FeatureCard from './ui/FeatureCard';
import { useTranslation } from 'react-i18next';

const FeaturesSection: React.FC = () => {
  const { t, i18n } = useTranslation();

  const features = [
    {
      title: t('features.cards.support.title'),
      description: t('features.cards.support.description'),
      icon: MessageCircle,
    },
    {
      title: t('features.cards.training.title'),
      description: t('features.cards.training.description'),
      icon: GraduationCap,
    },
    {
      title: t('features.cards.tips.title'),
      description: t('features.cards.tips.description'),
      icon: Lightbulb,
    },
    {
      title: t('features.cards.evolution.title'),
      description: t('features.cards.evolution.description'),
      icon: Wrench,
    },
  ];

  const circleSteps = [
    {
      number: 1,
      title: t('features.circle.steps.training.title'),
      description: t('features.circle.steps.training.description'),
      backText: i18n.language === 'fr' 
        ? "On fait appel à l'expert dès qu'on en a besoin et il répond en live."
        : "We call on the expert as soon as we need them and they respond live.",
      icon: GraduationCap,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: 2,
      title: t('features.circle.steps.resolution.title'),
      description: t('features.circle.steps.resolution.description'),
      backText: i18n.language === 'fr'
        ? "Le système peut proposer des optimisations de codes et détecter les incohérences."
        : "The system can suggest code optimizations and detect inconsistencies.",
      icon: Target,
      color: "from-green-500 to-green-600"
    },
    {
      number: 3,
      title: t('features.circle.steps.suggestions.title'),
      description: t('features.circle.steps.suggestions.description'),
      backText: i18n.language === 'fr'
        ? "Plus besoin de coder les requêtes, le système le fait pour vous."
        : "No more need to code queries, the system does it for you.",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600"
    },
    {
      number: 4,
      title: t('features.circle.steps.patches.title'),
      description: t('features.circle.steps.patches.description'),
      backText: i18n.language === 'fr'
        ? "Le système connaît votre version de Sage X3 et peut proposer un patch d'une version ultérieure qui traite ce problème."
        : "The system knows your Sage X3 version and can suggest a patch from a later version that addresses this issue.",
      icon: Zap,
      color: "from-orange-500 to-orange-600"
    },
    {
      number: 5,
      title: t('features.circle.steps.development.title'),
      description: t('features.circle.steps.development.description'),
      backText: i18n.language === 'fr'
        ? "Notre programmeur intégré peut vous proposer des personnalisations directement."
        : "Our integrated programmer can offer you customizations directly.",
      icon: Settings,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      number: 6,
      title: t('features.circle.steps.result.title'),
      description: t('features.circle.steps.result.description'),
      backText: i18n.language === 'fr'
        ? "Vous restez dans la boucle avec des analyses et des approbations."
        : "You stay in the loop with analyses and approvals.",
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">
            {i18n.language === 'fr' ? 'Solution 4-en-1 Intégrée à Sage X3' : '4-in-1 Solution Integrated with Sage X3'}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={index * 0.1}
            />
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-16 border border-slate-200 shadow-xl">
            <div className="mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full text-sm font-medium mb-6">
                {t('features.circle.badge')}
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {t('features.circle.title')}
              </h3>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-12">
                {t('features.circle.subtitle')}
              </p>
            </div>

            {/* Cercle vertueux - Version desktop avec effet flip */}
            <div className="hidden xl:block relative mb-12">
              <div className="relative w-full max-w-6xl mx-auto h-[650px]">
                {/* Cercle central */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-2xl z-20 border-4 border-white">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">Intell X3</div>
                  </div>
                </div>

                {/* Étapes du cercle avec effet flip */}
                <div className="relative w-full h-full">
                  {circleSteps.map((step, index) => {
                    const angle = (index * 60) - 90; // 60 degrés entre chaque étape
                    const radian = (angle * Math.PI) / 180;
                    const radius = 250; // Légèrement augmenté pour plus d'espace
                    const x = Math.cos(radian) * radius;
                    const y = Math.sin(radian) * radius;

                    return (
                      <div
                        key={index}
                        className="absolute flip-card"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)',
                          perspective: '1000px',
                        }}
                      >
                        <div className="flip-card-inner w-56 h-45">
                          {/* Face avant */}
                          <div className={`flip-card-front bg-gradient-to-br ${step.color} p-4 rounded-2xl shadow-xl text-white border-2 border-white/20`}>
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                                <span className="text-lg font-bold">{step.number}</span>
                              </div>
                              <step.icon className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-base mb-2">{step.title}</h4>
                            <p className="text-sm opacity-90 leading-relaxed">{step.description}</p>
                          </div>
                          
                          {/* Face arrière */}
                          <div className={`flip-card-back bg-gradient-to-br ${step.color} rounded-2xl shadow-xl text-white border-2 border-white/20`}>
                            <div className="flex flex-col items-center justify-center h-full p-4">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                                  <span className="text-sm font-bold">{step.number}</span>
                                </div>
                                <step.icon className="w-5 h-5" />
                              </div>
                              <p className="flip-card-back-text text-center leading-relaxed font-medium">
                                {step.backText}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Version tablette - Grille 2x3 avec effet flip */}
            <div className="hidden lg:block xl:hidden mb-12">
              <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
                {circleSteps.map((step, index) => (
                  <div key={index} className="relative flip-card" style={{ perspective: '1000px' }}>
                    <div className="flip-card-inner w-full h-55">
                      {/* Face avant */}
                      <div className={`flip-card-front bg-gradient-to-br ${step.color} p-6 rounded-2xl shadow-xl text-white`}>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                            <span className="text-lg font-bold">{step.number}</span>
                          </div>
                          <step.icon className="w-7 h-7" />
                        </div>
                        <h4 className="font-bold text-lg mb-3">{step.title}</h4>
                        <p className="text-sm opacity-90 leading-relaxed">{step.description}</p>
                      </div>
                      
                      {/* Face arrière */}
                      <div className={`flip-card-back bg-gradient-to-br ${step.color} rounded-2xl shadow-xl text-white`}>
                        <div className="flex flex-col items-center justify-center h-full p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                              <span className="text-lg font-bold">{step.number}</span>
                            </div>
                            <step.icon className="w-6 h-6" />
                          </div>
                          <p className="flip-card-back-text text-center leading-relaxed font-medium">
                            {step.backText}
                          </p>
                        </div>
                      </div>
                    </div>
                    {index < circleSteps.length - 1 && index % 2 === 1 && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Version mobile - Liste verticale avec effet flip */}
            <div className="lg:hidden space-y-6 mb-12">
              {circleSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flip-card-mobile" style={{ perspective: '1000px' }}>
                    <div className="flip-card-inner-mobile">
                      {/* Face avant */}
                      <div className="flip-card-front-mobile flex items-start space-x-4">
                        <div className={`bg-gradient-to-br ${step.color} p-4 rounded-xl shadow-lg text-white flex-shrink-0`}>
                          <div className="flex items-center justify-center">
                            <span className="text-sm font-bold mr-2">{step.number}</span>
                            <step.icon className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">{step.title}</h4>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                      
                      {/* Face arrière */}
                      <div className="flip-card-back-mobile flex items-center space-x-4">
                        <div className={`bg-gradient-to-br ${step.color} p-4 rounded-xl shadow-lg text-white flex-shrink-0`}>
                          <div className="flex items-center justify-center">
                            <span className="text-sm font-bold mr-2">{step.number}</span>
                            <step.icon className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="flip-card-back-text-mobile text-gray-800 leading-relaxed font-medium">
                            {step.backText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < circleSteps.length - 1 && (
                    <div className="flex justify-center mt-4">
                      <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Boutons d'action améliorés */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#examples"
                className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                {t('features.circle.cta.examples')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#pricing"
                className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition-all duration-300 font-medium hover:shadow-lg"
              >
                {t('features.circle.cta.pricing')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500 z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 animate-fade-in">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up">
            <a
              href="#examples"
              className="px-8 py-3 rounded-md bg-white text-primary-600 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              {t('hero.tryButton')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#pricing"
              className="px-8 py-3 rounded-md bg-transparent text-white border border-white font-medium hover:bg-white/10 transition-colors"
            >
              {t('hero.subscribeButton')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
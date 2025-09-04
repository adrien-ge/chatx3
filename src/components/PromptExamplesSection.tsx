import React from 'react';
import ChatDemo from './ChatDemo';
import { useTranslation } from 'react-i18next';

const PromptExamplesSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="examples" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full text-sm font-medium mb-6">
            ✨ {t('examples.chat.interactiveDemo')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('examples.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('examples.subtitle')}
          </p>
        </div>

        <ChatDemo />

        <div className="text-center mt-12">
          <a
            href="#pricing"
            className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {t('examples.tryMore')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default PromptExamplesSection;
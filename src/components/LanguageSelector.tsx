import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    localStorage.setItem('preferred-language', languageCode);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm border border-white/20 text-gray-800 hover:bg-white transition-all duration-300 group"
        title="Changer la langue"
      >
        <Globe className="h-4 w-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
        <span className="text-sm font-medium text-gray-800">{currentLanguage.name}</span>
        <ChevronDown className={`h-3 w-3 text-gray-600 group-hover:text-gray-800 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-gradient-custom-blue rounded-xl shadow-2xl py-1 z-50 border border-white/20 backdrop-blur-sm">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-3 py-2 text-sm text-white hover:bg-white/20 transition-all duration-300 rounded-lg ${
                  i18n.language === language.code ? 'bg-white/20 font-semibold' : ''
                }`}
              >
                {language.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;

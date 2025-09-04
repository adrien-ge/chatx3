import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PromptCardProps {
  prompt: string;
  result: string;
  delay?: number;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, result, delay = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden card-hover-animation"
      style={{ 
        animationDelay: `${delay}s`,
        opacity: 0,
        animation: `fadeIn 0.5s ease-out ${delay}s forwards, slideUp 0.5s ease-out ${delay}s forwards`
      }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {prompt}
          </h3>
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="ml-2 text-gray-500 hover:text-primary-600 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        <div 
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 mt-4' : 'max-h-0'
          }`}
        >
          <div className="relative bg-gray-50 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <button 
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-primary-600 transition-colors"
              title="Copy to clipboard"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-sm text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
        >
          {isExpanded ? t('examples.hideCode') : t('examples.showCode')}
          {isExpanded ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptCard;
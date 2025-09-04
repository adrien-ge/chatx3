import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ChatDemo: React.FC = () => {
  const [showQuestion, setShowQuestion] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [typedResponse, setTypedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { t, i18n } = useTranslation();
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const restartRef = useRef<NodeJS.Timeout | null>(null);
  const currentLanguage = useRef(i18n.language);

  const question = t('examples.demoQuestion');
  const response = t('examples.demoResponse');

  const clearAllTimeouts = () => {
    if (animationRef.current) clearTimeout(animationRef.current);
    if (typingRef.current) clearInterval(typingRef.current);
    if (restartRef.current) clearTimeout(restartRef.current);
  };

  const resetState = () => {
    clearAllTimeouts();
    setShowQuestion(false);
    setShowResponse(false);
    setTypedResponse('');
    setIsTyping(false);
    setIsComplete(false);
  };

  const typeResponse = () => {
    let index = 0;
    setIsTyping(true);
    
    typingRef.current = setInterval(() => {
      if (index < response.length) {
        setTypedResponse(response.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingRef.current!);
        setIsTyping(false);
        setIsComplete(true);
        
        // Restart the demo after 6 seconds (plus de temps pour lire)
        restartRef.current = setTimeout(() => {
          if (!document.hidden) { // Ne redémarre que si la page est visible
            startDemo();
          }
        }, 6000);
      }
    }, 30); // Vitesse de frappe plus rapide pour réduire la durée totale
  };

  const startDemo = () => {
    resetState();

    // Show question after 1 second
    animationRef.current = setTimeout(() => {
      setShowQuestion(true);
      
      // Start response after 2 seconds
      setTimeout(() => {
        setShowResponse(true);
        typeResponse();
      }, 2000);
    }, 1000);
  };

  // Start the demo when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startDemo();
    }, 500);

    return () => {
      clearTimeout(timer);
      clearAllTimeouts();
    };
  }, []);

  // Restart when language changes
  useEffect(() => {
    if (currentLanguage.current !== i18n.language) {
      currentLanguage.current = i18n.language;
      const timer = setTimeout(() => {
        startDemo();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [i18n.language, question, response]);

  // Pause animation when page is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearAllTimeouts();
      } else if (isComplete) {
        // Redémarre seulement si l'animation était terminée
        const timer = setTimeout(() => {
          startDemo();
        }, 1000);
        return () => clearTimeout(timer);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Interface */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{t('examples.chat.assistantName')}</h3>
              <p className="text-white/80 text-sm">{t('examples.chat.expertOnline')}</p>
            </div>
            <div className="ml-auto flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-white/80 text-sm">{t('examples.chat.online')}</span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="p-6 min-h-[400px] bg-gray-50">
          {/* Welcome Message */}
          <div className="flex items-start mb-6 opacity-100">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-md">
              <p className="text-gray-800 text-sm">
                {t('examples.chat.welcomeMessage')}
              </p>
            </div>
          </div>

          {/* User Question */}
          <div className={`flex items-start justify-end mb-6 transition-all duration-700 ease-out ${
            showQuestion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm max-w-md">
              <p className="text-sm">{question}</p>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
              <span className="text-gray-600 text-xs font-medium">U</span>
            </div>
          </div>

          {/* Typing Indicator */}
          <div className={`flex items-start mb-4 transition-all duration-500 ease-out ${
            showQuestion && !showResponse ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <Sparkles className="h-4 w-4 text-white animate-spin" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{t('examples.chat.aiThinking')}</span>
              </div>
            </div>
          </div>

          {/* AI Response */}
          <div className={`flex items-start transition-all duration-700 ease-out ${
            showResponse ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-2xl">
              <p className="text-gray-800 text-sm leading-relaxed">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent font-medium transition-all duration-300">
                  {typedResponse}
                </span>
                {isTyping && (
                  <span className="inline-block w-0.5 h-4 bg-gradient-to-r from-purple-600 to-blue-600 ml-1 animate-pulse"></span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Input (Disabled for demo) */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder={t('examples.chat.placeholder')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
              disabled
            />
            <button
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full font-medium opacity-50 cursor-not-allowed"
              disabled
            >
              {t('examples.chat.send')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDemo;
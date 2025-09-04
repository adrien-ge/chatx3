import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  ThumbsUp,
  ThumbsDown,
  Clock,
  Loader2,
  RefreshCw,
  Brain,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { webhookService } from '../../lib/webhook';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// === TYPES POUR LE CHAT SIMPLE ===
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  processingTime?: number;
  hasError?: boolean;
  isRetryable?: boolean;
}

interface OperationState {
  type: 'idle' | 'sending';
  timestamp: number;
  startTime?: number;
}

const AIAssistant: React.FC = () => {
  const { user, currentCompany } = useAuth();
  
  // Indisponible si l'URL du webhook n'est pas configurée
  if (!webhookService.isConfigured()) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="max-w-xl w-full bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Service IA indisponible</h2>
          <p className="text-gray-600 mb-6">
            L'URL du webhook n'est pas configurée. Veuillez définir la variable
            d'environnement <code>VITE_N8N_WEBHOOK_URL</code> dans votre fichier <code>.env</code>.
          </p>
          <code className="block bg-gray-100 p-3 rounded text-sm">VITE_N8N_WEBHOOK_URL=https://votre-instance-n8n/webhook/rag-chat</code>
        </div>
      </div>
    );
  }
  
  // === ÉTAT SIMPLE ===
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [operation, setOperation] = useState<OperationState>({ type: 'idle', timestamp: Date.now() });
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [serviceStatus, setServiceStatus] = useState<'online' | 'offline' | 'degraded'>('online');
  
  // === GESTION DE LA CONVERSATION ===
  const [conversationId, setConversationId] = useState<string>(() => `simple_chat_${Date.now()}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const operationLockRef = useRef<boolean>(false);
  const processingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageRef = useRef<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // === FONCTIONS UTILITAIRES ===
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const acquireOperationLock = useCallback((): boolean => {
    if (operationLockRef.current) {
      return false;
    }
    operationLockRef.current = true;
    return true;
  }, []);

  const releaseOperationLock = useCallback(() => {
    operationLockRef.current = false;
  }, []);

  // === TIMER POUR LE TEMPS DE TRAITEMENT ===
  const startProcessingTimer = useCallback(() => {
    setProcessingTime(0);
    processingTimerRef.current = setInterval(() => {
      setProcessingTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopProcessingTimer = useCallback(() => {
    if (processingTimerRef.current) {
      clearInterval(processingTimerRef.current);
      processingTimerRef.current = null;
    }
  }, []);

  // === NETTOYAGE ===
  useEffect(() => {
    return () => {
      stopProcessingTimer();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [stopProcessingTimer]);

  // === AUTO-SCROLL ===
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // === FONCTION DE RETRY MANUELLE ===
  const retryLastMessage = useCallback(async () => {
    if (!lastMessageRef.current || operation.type !== 'idle') {
      return;
    }

    // Supprimer le dernier message d'erreur
    setMessages(prev => prev.slice(0, -1));
    setError(null);

    // Relancer l'envoi
    await handleSubmitMessage(lastMessageRef.current);
  }, [operation.type]);

  // === ENVOI DE MESSAGE AVEC UNE SEULE REQUÊTE ===
  const handleSubmitMessage = async (messageContent: string) => {
    // Vérifier le verrou d'opération
    if (!acquireOperationLock()) {
      console.log('⚠️ Opération déjà en cours, requête ignorée');
      return;
    }

    // Annuler toute requête précédente
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessageId = `user_${Date.now()}`;
    const assistantMessageId = `assistant_${Date.now()}`;
    const startTime = Date.now();

    try {
      setError(null);
      setOperation({ 
        type: 'sending', 
        timestamp: Date.now(), 
        startTime
      });

      // Ajouter le message utilisateur
      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content: messageContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      lastMessageRef.current = messageContent;

      // Démarrer le timer de traitement
      startProcessingTimer();

      // Ajouter le message de chargement
      const loadingMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true
      };

      setMessages(prev => [...prev, loadingMessage]);

      // Créer un nouveau AbortController pour cette requête
      abortControllerRef.current = new AbortController();

      // Préparer les données du webhook avec l'ID de conversation persistant
      const webhookData = {
        user_id: user?.id || 'anonymous',
        conversation_id: conversationId,
        message_id: userMessageId,
        message_content: messageContent,
        conversation_type: 'Question',
        user_email: user?.email || 'anonymous@example.com',
        company_name: currentCompany?.name || 'Non définie'
      };

      console.log('🚀 Envoi webhook pour chat simple...', webhookData);

      // Envoyer le webhook (UNE SEULE REQUÊTE)
      const webhookResult = await webhookService.sendMessageWebhook(webhookData);

      // Vérifier si la requête a été annulée
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🚫 Requête annulée');
        return;
      }

      if (!webhookResult.success) {
        // Déterminer le statut du service
        if (webhookResult.error?.includes('workflow') || webhookResult.error?.includes('500')) {
          setServiceStatus('degraded');
        } else if (webhookResult.error?.includes('connexion') || webhookResult.error?.includes('réseau')) {
          setServiceStatus('offline');
        }

        throw new Error(webhookResult.error || 'Pas de réponse reçue');
      }

      const endTime = Date.now();
      const totalProcessingTime = Math.round((endTime - startTime) / 1000);

      // Remplacer le message de chargement par la réponse
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: webhookResult.response || 'Réponse vide reçue',
        timestamp: new Date(),
        isLoading: false,
        processingTime: totalProcessingTime
      };

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? assistantMessage : msg
      ));

      // Réinitialiser le statut du service en cas de succès
      setServiceStatus('online');
      stopProcessingTimer();
      setOperation({ type: 'idle', timestamp: Date.now() });

    } catch (error) {
      // Vérifier si la requête a été annulée
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🚫 Requête annulée par l\'utilisateur');
        return;
      }

      console.error('❌ Erreur envoi message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'envoi du message';
      
      // Déterminer si l'erreur permet un retry manuel
      const isRetryable = errorMessage.includes('temporairement') || 
                         errorMessage.includes('réessayer') ||
                         errorMessage.includes('connexion') ||
                         errorMessage.includes('workflow') ||
                         errorMessage.includes('surchargé');

      setError(errorMessage);
      
      // Remplacer le message de chargement par un message d'erreur
      const errorAssistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: `❌ ${errorMessage}`,
        timestamp: new Date(),
        isLoading: false,
        hasError: true,
        isRetryable
      };

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? errorAssistantMessage : msg
      ));
      
      stopProcessingTimer();
      setOperation({ type: 'idle', timestamp: Date.now() });
    } finally {
      releaseOperationLock();
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier qu'on peut envoyer
    if (!input.trim() || operation.type !== 'idle') {
      return;
    }

    const messageContent = input.trim();
    setInput(''); // Vider le champ immédiatement
    await handleSubmitMessage(messageContent);
  };

  // === FONCTIONS D'ÉVALUATION (OPTIONNELLES) ===
  const handleMessageEvaluation = (messageId: string, rating: 'thumbs_up' | 'thumbs_down') => {
    console.log(`Message ${messageId} évalué: ${rating}`);
    // Ici on pourrait envoyer l'évaluation à un service si nécessaire
  };

  // === FONCTION DE NOUVELLE CONVERSATION ===
  const handleNewConversation = () => {
    // Annuler toute requête en cours
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setMessages([]);
    setError(null);
    setProcessingTime(0);
    stopProcessingTimer();
    setOperation({ type: 'idle', timestamp: Date.now() });
    lastMessageRef.current = '';
    setServiceStatus('online');
    releaseOperationLock();
    
    // Générer un nouvel ID de conversation
    const newConversationId = `simple_chat_${Date.now()}`;
    setConversationId(newConversationId);
    console.log('🔄 Nouvelle conversation créée avec ID:', newConversationId);
  };

  // === VARIABLES DÉRIVÉES ===
  const isSending = operation.type === 'sending';
  const canSendMessage = operation.type === 'idle' && input.trim();

  // === COMPOSANT DE RÉFLEXION AVANCÉ ===
  const ThinkingIndicator = () => {
    const [dots, setDots] = useState('');
    
    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      
      return () => clearInterval(interval);
    }, []);

    const getThinkingMessage = () => {
      if (processingTime < 10) return "L'IA analyse votre question";
      if (processingTime < 60) return "L'IA formule une réponse détaillée";
      if (processingTime < 120) return "L'IA vérifie et optimise sa réponse";
      if (processingTime < 300) return "L'IA traite une réponse complexe";
      return "L'IA finalise sa réponse complète";
    };

    const getTimeDisplay = () => {
      if (processingTime < 60) {
        return `${processingTime}s`;
      } else {
        const minutes = Math.floor(processingTime / 60);
        const seconds = processingTime % 60;
        return `${minutes}m ${seconds}s`;
      }
    };

    return (
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Brain className="h-5 w-5 text-primary-600 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-600 rounded-full animate-ping"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              {getThinkingMessage()}{dots}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {getTimeDisplay()}
            </span>
          </div>
          {processingTime > 15 && processingTime < 120 && (
            <div className="text-xs text-gray-500 mt-1">
              Les réponses complexes peuvent prendre plusieurs minutes
            </div>
          )}
          {processingTime >= 120 && processingTime < 300 && (
            <div className="text-xs text-blue-600 mt-1 flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Traitement en cours - Les réponses détaillées nécessitent plus de temps</span>
            </div>
          )}
          {processingTime >= 300 && (
            <div className="text-xs text-orange-600 mt-1 flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3" />
              <span>Temps de traitement élevé - L'IA travaille sur une réponse très complexe</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // === COMPOSANT DE STATUT DU SERVICE ===
  const ServiceStatusIndicator = () => {
    const getStatusConfig = () => {
      switch (serviceStatus) {
        case 'online':
          return {
            icon: Wifi,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            text: 'Service en ligne',
            dotColor: 'bg-green-400'
          };
        case 'degraded':
          return {
            icon: AlertTriangle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            text: 'Service dégradé',
            dotColor: 'bg-orange-400'
          };
        case 'offline':
          return {
            icon: WifiOff,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            text: 'Service hors ligne',
            dotColor: 'bg-red-400'
          };
      }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${config.bgColor}`}>
        <div className={`w-2 h-2 ${config.dotColor} rounded-full ${serviceStatus === 'online' ? 'animate-pulse' : ''}`}></div>
        <Icon className={`h-3 w-3 ${config.color}`} />
        <span className={`text-xs font-medium ${config.color}`}>{config.text}</span>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-white">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Assistant IA Sage X3</h3>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ServiceStatusIndicator />
              
              <button
                onClick={handleNewConversation}
                disabled={operation.type !== 'idle'}
                className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-lg transition-colors ${
                  operation.type !== 'idle'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <RefreshCw className="h-3 w-3" />
                <span>Nouvelle conversation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Indicateur de réflexion global */}
        {isSending && (
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <ThinkingIndicator />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comment puis-je vous aider ?
              </h3>
              <p className="text-gray-600 max-w-md mb-4">
                Posez-moi vos questions sur Sage X3, je suis là pour vous aider avec vos problèmes techniques, configurations et optimisations.
              </p>
              <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md">
                💡 <strong>Note :</strong> Les réponses peuvent prendre plusieurs minutes selon la complexité de votre question.
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-3xl ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-primary-100' 
                      : message.hasError
                      ? 'bg-red-100'
                      : 'bg-gradient-to-r from-primary-600 to-secondary-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-primary-600" />
                    ) : message.hasError ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : message.hasError
                        ? 'bg-red-50 text-red-900 border border-red-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.isLoading ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Brain className="h-5 w-5 text-primary-600 animate-pulse" />
                            <span className="text-sm font-medium text-gray-700">
                              L'IA réfléchit à votre question...
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              Cela peut prendre plusieurs minutes
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {message.role === 'user' ? (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          ) : (
                            <div className="text-sm leading-relaxed markdown-content">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${
                              message.role === 'user' 
                                ? 'text-primary-100' 
                                : message.hasError
                                ? 'text-red-600'
                                : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                              {message.processingTime && (
                                <span className="ml-2">• Traité en {message.processingTime}s</span>
                              )}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {message.role === 'assistant' && !message.isLoading && (
                      <div className="flex items-center space-x-2 mt-2">
                        {message.hasError && message.isRetryable ? (
                          <button
                            onClick={retryLastMessage}
                            disabled={operation.type !== 'idle'}
                            className="flex items-center space-x-1 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Réessayer</span>
                          </button>
                        ) : !message.hasError && (
                          <>
                            <button
                              onClick={() => handleMessageEvaluation(message.id, 'thumbs_up')}
                              className="p-1 rounded transition-colors text-gray-400 hover:text-green-600 hover:bg-green-50"
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </button>
                            
                            <button
                              onClick={() => handleMessageEvaluation(message.id, 'thumbs_down')}
                              className="p-1 rounded transition-colors text-gray-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-red-800 text-sm font-medium mb-1">Erreur de communication</div>
                <div className="text-red-700 text-sm">{error}</div>
                {lastMessageRef.current && (
                  <button
                    onClick={retryLastMessage}
                    disabled={operation.type !== 'idle'}
                    className="mt-2 flex items-center space-x-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Réessayer</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 ml-auto"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isSending ? "L'IA réfléchit..." : "Tapez votre message..."}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              disabled={operation.type !== 'idle'}
            />

            <button
              type="submit"
              disabled={!canSendMessage}
              className="px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={
                !input.trim() ? "Tapez un message" :
                isSending ? "L'IA réfléchit..." :
                "Envoyer le message"
              }
            >
              {isSending ? (
                <Brain className="h-4 w-4 animate-pulse" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

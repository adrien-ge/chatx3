import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Send, Bot, User, Plus, Settings, MessageSquare, Zap, Sparkles } from 'lucide-react';

function ChatPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Bonjour ! Je suis ChatX3, votre assistant IA spécialisé Sage X3. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.replace('/');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simuler une réponse de l'IA
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai' as const,
        content: `Je comprends votre question : "${inputMessage}". Voici une réponse détaillée basée sur mes connaissances actuelles...`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-custom-blue-dark">
      {/* Sidebar gauche */}
      <div className="w-80 bg-white/10 backdrop-blur-sm border-r border-white/20 flex flex-col">
        {/* Header du sidebar */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-400 rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">ChatX3</span>
          </div>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300">
            <Plus className="h-5 w-5" />
            <span>Nouvelle conversation</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-3">
              <MessageSquare className="h-5 w-5" />
              <span>Conversations</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-3">
              <Zap className="h-5 w-5" />
              <span>Modèles IA</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-3">
              <Settings className="h-5 w-5" />
              <span>Paramètres</span>
            </button>
          </div>
        </nav>

        {/* User info et déconnexion */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{user?.email}</p>
              <p className="text-gray-300 text-xs">Utilisateur</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Zone de chat principale */}
      <div className="flex-1 flex flex-col">
        {/* Header du chat */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Assistant IA Sage X3</h1>
          </div>
        </div>

        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                    : 'bg-gradient-to-r from-green-500 to-green-400'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-custom-blue text-white'
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-300'
                  }`}>
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-3xl">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message ici..."
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-xl hover:from-green-600 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Envoyer</span>
              </button>
            </div>
            <p className="text-xs text-gray-300 mt-2 text-center">
              Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthModal from '../components/auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';

function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isConfigured } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isConfigured) {
      navigate('/chat');
    }
  }, [user, isConfigured, navigate]);

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-custom-blue-dark">
      <Navbar onAuthClick={handleAuthClick} />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center text-white">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-green-400 rounded-2xl mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Votre expert <span className="text-green-400">Sage X3</span><br />
            quand vous en avez besoin !
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed">
            Achetez-vous la tranquillité et faites entrer l'IA au centre de votre ERP et en toute sécurité.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={handleAuthClick}
              className="bg-custom-blue text-white px-8 py-4 rounded-xl hover:bg-custom-blue-dark transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-2xl border-2 border-custom-blue"
            >
              S'abonner
            </button>
            <button className="bg-white text-custom-blue px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold text-lg border-2 border-custom-blue flex items-center space-x-2">
              <span>Voir des exemples</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Solution Tag */}
          <div className="mb-16">
            <div className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-sm font-medium">
              Solution 4-en-1 Intégrée à Sage X3
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Rapide & Efficace</h3>
              <p className="text-gray-300">Réponses instantanées avec une précision exceptionnelle</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Intelligence Avancée</h3>
              <p className="text-gray-300">Technologie de pointe pour des conversations naturelles</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Sécurisé & Privé</h3>
              <p className="text-gray-300">Vos données sont protégées et restent confidentielles</p>
            </div>
          </div>

          {/* Lower Section with White Background */}
          <div className="bg-white rounded-3xl p-12 max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Une Solution Complète et Intégrée
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Découvrez comment notre solution d'IA révolutionne la gestion de votre ERP Sage X3. 
                Automatisez vos processus, optimisez votre productivité et prenez des décisions éclairées 
                grâce à notre technologie de pointe.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-300">
          <p>&copy; 2024 ChatX3. Tous droits réservés.</p>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default LandingPage;
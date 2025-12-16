import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Statistics from './components/Statistics/Statistics';
import Categories from './components/Categories/Categories';
import EligibilityChecker from './components/EligibilityChecker/EligibilityChecker';
import SchemeDetails from './components/SchemeDetails/SchemeDetails';
import AuthModal from './components/Auth/AuthModal';
import Chatbot from './components/Chatbot/Chatbot';
import Footer from './components/Footer/Footer';
import { useLanguage } from './utils/LanguageContext';

interface User {
  id?: number;
  name: string;
  username: string;
  mobile: string;
  dob?: string;
  gender?: string;
}

function App() {
  const { translations } = useLanguage();
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState<number | null>(null);
  const [isSchemeDetailsOpen, setIsSchemeDetailsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('sahayataUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser) as User);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('sahayataUser');
      }
    }
  }, []);

  const handleSchemeClick = (schemeId: number) => {
    setSelectedSchemeId(schemeId);
    setIsSchemeDetailsOpen(true);
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('sahayataUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sahayataUser');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header 
        onSchemeClick={handleSchemeClick}
        onSignInClick={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Eligibility Button */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Welcome to Sahayata<span className="text-primary-orange">AI</span> 🇮🇳
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your multilingual platform to discover and access government schemes in English, Telugu, and Hindi
          </p>
          
          <button 
            onClick={() => setIsEligibilityOpen(true)}
            className="bg-primary-orange hover:bg-primary-darkorange text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {translations.checkEligibility}
          </button>
        </div>

        {/* Statistics Cards */}
        <Statistics />

        {/* Categories Grid */}
        <Categories />

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mt-16 border-t-4 border-primary-orange">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="w-8 h-8 text-primary-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">
                About SahayataAI
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-4">
                SahayataAI is a <span className="font-semibold text-primary-orange">multilingual platform</span> designed to make government schemes accessible to everyone. 
                Whether you're looking for education, health, agriculture, or employment schemes, we help you 
                find the right support.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg mb-4">
                Our <span className="font-semibold text-primary-orange">AI chatbot</span> assists you in <span className="font-semibold">English, Telugu, and Hindi</span> to ensure no one is 
                left behind in accessing government benefits.
              </p>
              <div className="bg-orange-50 border-l-4 border-primary-orange p-4 rounded-r-lg">
                <p className="text-gray-700 text-sm">
                  <strong className="text-primary-orange">Note:</strong> This is a social service platform and not an official government portal. 
                  All scheme information is sourced from official government websites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-8 right-8 bg-primary-orange hover:bg-primary-darkorange text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 z-40"
        title="Open AI Assistant"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Footer */}
      <Footer />

      {/* Chatbot Modal */}
      <Chatbot 
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Eligibility Checker Modal */}
      <EligibilityChecker 
        isOpen={isEligibilityOpen} 
        onClose={() => setIsEligibilityOpen(false)} 
      />

      {/* Scheme Details Modal */}
      <SchemeDetails
        schemeId={selectedSchemeId}
        isOpen={isSchemeDetailsOpen}
        onClose={() => {
          setIsSchemeDetailsOpen(false);
          setSelectedSchemeId(null);
        }}
      />
    </div>
  );
}

export default App;

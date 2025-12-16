import { useState, useEffect } from 'react';
import { useLanguage } from '../utils/LanguageContext';
import Categories from '../components/Categories/Categories';
import Chatbot from '../components/Chatbot/Chatbot';

const Home = () => {
  const { language } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    ap: 0,
    central: 0
  });

  useEffect(() => {
    // Fetch stats from backend
    const fetchStats = async () => {
      try {
        const response = await fetch('https://sahayataai-backend.onrender.com/api/chatbot/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          // Fallback to default values
          setStats({ total: 100, ap: 24, central: 76 });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to default values
        setStats({ total: 100, ap: 24, central: 76 });
      }
    };

    fetchStats();
  }, []);

  const content = {
    en: {
      welcome: 'Welcome to SahayataAI',
      subtitle: 'Your multilingual platform to discover and access government schemes in English, Telugu, and Hindi',
      checkEligibility: 'Check Eligibility',
      findSchemes: 'Find schemes based on categories',
      aboutTitle: 'About SahayataAI',
      aboutText: 'SahayataAI is a multilingual platform designed to make government schemes accessible to everyone. Whether you\'re looking for education, health, agriculture, or employment schemes, we help you find the right support.',
      chatbotText: 'Our AI chatbot assists you in English, Telugu, and Hindi to ensure no one is left behind in accessing government benefits.',
      totalSchemes: 'Total Schemes',
      apSchemes: 'AP Govt Schemes',
      centralSchemes: 'Central Schemes',
      allSchemes: 'All available schemes',
      stateGovt: 'State Government',
      centralGovt: 'Central Government'
    },
    te: {
      welcome: 'సహాయతAIకి స్వాగతం',
      subtitle: 'ఆంగ్లం, తెలుగు మరియు హిందీలో ప్రభుత్వ పథకాలను కనుగొని యాక్సెస్ చేయడానికి మీ బహుభాషా వేదిక',
      checkEligibility: 'అర్హత తనిఖీ చేయండి',
      findSchemes: 'వర్గాల ఆధారంగా పథకాలను కనుగొనండి',
      aboutTitle: 'సహాయతAI గురించి',
      aboutText: 'సహాయతAI అనేది ప్రభుత్వ పథకాలను అందరికీ అందుబాటులో ఉంచడానికి రూపొందించిన బహుభాషా వేదిక. మీరు విద్య, ఆరోగ్యం, వ్యవసాయం లేదా ఉద్యోగ పథకాల కోసం వెతుకుతున్నా, మేము మీకు సరైన మద్దతును కనుగొనడంలో సహాయం చేస్తాము.',
      chatbotText: 'మా AI చాట్‌బాట్ ప్రభుత్వ ప్రయోజనాలను యాక్సెస్ చేయడంలో ఎవరూ వెనుకబడకుండా చూసుకోవడానికి ఆంగ్లం, తెలుగు మరియు హిందీలో మీకు సహాయం చేస్తుంది.',
      totalSchemes: 'మొత్తం పథకాలు',
      apSchemes: 'AP ప్రభుత్వ పథకాలు',
      centralSchemes: 'కేంద్ర పథకాలు',
      allSchemes: 'అన్ని అందుబాటులో ఉన్న పథకాలు',
      stateGovt: 'రాష్ట్ర ప్రభుత్వం',
      centralGovt: 'కేంద్ర ప్రభుత్వం'
    },
    hi: {
      welcome: 'सहायताAI में आपका स्वागत है',
      subtitle: 'अंग्रेजी, तेलुगु और हिंदी में सरकारी योजनाओं को खोजने और एक्सेस करने के लिए आपका बहुभाषी मंच',
      checkEligibility: 'पात्रता जांचें',
      findSchemes: 'श्रेणियों के आधार पर योजनाएं खोजें',
      aboutTitle: 'सहायताAI के बारे में',
      aboutText: 'सहायताAI एक बहुभाषी मंच है जो सरकारी योजनाओं को सभी के लिए सुलभ बनाने के लिए डिज़ाइन किया गया है। चाहे आप शिक्षा, स्वास्थ्य, कृषि या रोजगार योजनाओं की तलाश कर रहे हों, हम आपको सही समर्थन खोजने में मदद करते हैं।',
      chatbotText: 'हमारा AI चैटबॉट अंग्रेजी, तेलुगु और हिंदी में आपकी सहायता करता है ताकि सरकारी लाभों तक पहुंचने में कोई पीछे न रहे।',
      totalSchemes: 'कुल योजनाएं',
      apSchemes: 'AP सरकार की योजनाएं',
      centralSchemes: 'केंद्रीय योजनाएं',
      allSchemes: 'सभी उपलब्ध योजनाएं',
      stateGovt: 'राज्य सरकार',
      centralGovt: 'केंद्र सरकार'
    }
  };

  const currentContent = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-lightgray to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          {currentContent.welcome} <span className="text-primary-orange">🇮🇳</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          {currentContent.subtitle}
        </p>
        <button className="bg-primary-orange hover:bg-primary-darkorange text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105">
          ✅ {currentContent.checkEligibility}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Total Schemes */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 mx-auto">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-blue-700 mb-2">{stats.total}</h3>
            <p className="text-lg font-semibold text-blue-800">{currentContent.totalSchemes}</p>
            <p className="text-sm text-blue-600 mt-1">{currentContent.allSchemes}</p>
          </div>

          {/* AP Schemes */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 mx-auto">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-green-700 mb-2">{stats.ap}</h3>
            <p className="text-lg font-semibold text-green-800">{currentContent.apSchemes}</p>
            <p className="text-sm text-green-600 mt-1">{currentContent.stateGovt}</p>
          </div>

          {/* Central Schemes */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 mx-auto">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-orange-700 mb-2">{stats.central}</h3>
            <p className="text-lg font-semibold text-orange-800">{currentContent.centralSchemes}</p>
            <p className="text-sm text-orange-600 mt-1">{currentContent.centralGovt}</p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          {currentContent.findSchemes}
        </h2>
        <Categories />
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border-l-4 border-primary-orange">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">{currentContent.aboutTitle}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                SahayataAI is a <span className="font-semibold text-primary-orange">multilingual platform</span> {currentContent.aboutText.split('multilingual platform')[1]}
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our <span className="font-semibold text-primary-orange">AI chatbot</span> assists you in <span className="font-semibold">English, Telugu, and Hindi</span> {currentContent.chatbotText.split('English, Telugu, and Hindi')[1]}
              </p>
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> This is a social service platform and not an official government portal. All scheme information is sourced from official government websites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-orange hover:bg-primary-darkorange text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 z-40"
        aria-label="Open chat"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Chatbot Modal */}
      {isChatOpen && (
        <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
};

export default Home;

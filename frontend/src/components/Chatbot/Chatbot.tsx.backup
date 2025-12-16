import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../utils/LanguageContext';

interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
  schemes?: any[];
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot = ({ isOpen, onClose }: ChatbotProps) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Welcome messages
  const welcomeMessages = {
    en: "Hello! I'm your SahayataAI assistant. Ask me about government schemes in English, Telugu, or Hindi. How can I help you today?",
    te: "నమస్కారం! నేను మీ సహాయతAI అసిస్టెంట్. ఆంగ్లం, తెలుగు లేదా హిందీలో ప్రభుత్వ పథకాల గురించి నన్ను అడగండి. నేను మీకు ఎలా సహాయం చేయగలను?",
    hi: "नमस्ते! मैं आपका सहायताAI सहायक हूं। अंग्रेजी, तेलुगु या हिंदी में सरकारी योजनाओं के बारे में मुझसे पूछें। मैं आज आपकी कैसे मदद कर सकता हूं?"
  };

  // Quick category filters - MOBILE OPTIMIZED
  const quickCategories = {
    en: [
      { label: "🎓 Education", query: "education scholarship student" },
      { label: "🌾 Agriculture", query: "farmer agriculture crop" },
      { label: "👩 Women", query: "women empowerment mahila" },
      { label: "🏥 Health", query: "health medical insurance" },
      { label: "🏠 Housing", query: "housing awas home" },
      { label: "💼 Employment", query: "employment job skill training" },
    ],
    te: [
      { label: "🎓 విద్య", query: "విద్యార్థి విద్య స్కాలర్‌షిప్" },
      { label: "🌾 వ్యవసాయం", query: "రైతు వ్యవసాయం పంట" },
      { label: "👩 మహిళలు", query: "మహిళ సాధికారత" },
      { label: "🏥 ఆరోగ్యం", query: "ఆరోగ్యం వైద్యం బీమా" },
      { label: "🏠 గృహాలు", query: "గృహం ఇల్లు ఆవాసం" },
      { label: "💼 ఉద్యోగం", query: "ఉద్యోగం పని నైపుణ్యం" },
    ],
    hi: [
      { label: "🎓 शिक्षा", query: "शिक्षा छात्रवृत्ति छात्र" },
      { label: "🌾 कृषि", query: "किसान कृषि फसल" },
      { label: "👩 महिला", query: "महिला सशक्तिकरण" },
      { label: "🏥 स्वास्थ्य", query: "स्वास्थ्य चिकित्सा बीमा" },
      { label: "🏠 आवास", query: "आवास घर मकान" },
      { label: "💼 रोजगार", query: "रोजगार नौकरी कौशल" },
    ],
  };

  // Initialize welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'bot',
        text: welcomeMessages[language as keyof typeof welcomeMessages] || welcomeMessages.en,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, language]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      const langCodes: { [key: string]: string } = {
        en: 'en-IN',
        te: 'te-IN',
        hi: 'hi-IN'
      };
      recognitionRef.current.lang = langCodes[language] || 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const langCodes: { [key: string]: string } = {
        en: 'en-IN',
        te: 'te-IN',
        hi: 'hi-IN'
      };
      utterance.lang = langCodes[language] || 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Handle quick category search
  const handleQuickSearch = (query: string) => {
    setInputText(query);
    sendMessage(query);
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: language
        })
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.response,
        schemes: data.schemes,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      speakText(data.response);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        type: 'bot',
        text: language === 'en' ? 'Sorry, I encountered an error. Please try again.' :
              language === 'te' ? 'క్షమించండి, నాకు ఒక లోపం ఎదురైంది. దయచేసి మళ్లీ ప్రయత్నించండి.' :
              'क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुन: प्रयास करें।',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* MAIN CHATBOT - MOBILE OPTIMIZED */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white w-full h-full sm:rounded-2xl sm:shadow-2xl sm:max-w-4xl sm:h-[85vh] flex flex-col">
          {/* HEADER - COMPACT FOR MOBILE */}
          <div className="bg-gradient-to-r from-primary-orange to-orange-600 text-white p-3 sm:p-5 sm:rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-bold">SahayataAI Assistant</h2>
                <p className="text-xs text-white/80">
                  {language === 'en' ? 'Ask me anything about schemes' :
                   language === 'te' ? 'పథకాల గురించి అడగండి' :
                   'योजनाओं के बारे में पूछें'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* CATEGORY FILTERS - HORIZONTAL SCROLL ON MOBILE */}
          <div className="border-b bg-gradient-to-r from-orange-50 to-blue-50 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 p-2 min-w-max px-3">
              {quickCategories[language as keyof typeof quickCategories].map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickSearch(cat.query)}
                  className="px-3 py-1.5 text-xs font-medium bg-white border-2 border-gray-200 rounded-full hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 shadow-sm whitespace-nowrap flex-shrink-0"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl p-3 ${
                      message.type === 'user'
                        ? 'bg-primary-orange text-white'
                        : 'bg-white border-2 border-gray-200 text-gray-800 shadow-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    
                    {/* SCHEMES LIST */}
                    {message.schemes && message.schemes.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-bold text-gray-600 mb-2">
                          {language === 'en' ? '📋 Relevant Schemes:' :
                           language === 'te' ? '📋 సంబంధిత పథకాలు:' :
                           '📋 प्रासंगिक योजनाएं:'}
                        </p>
                        {message.schemes.map((scheme, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedScheme(scheme)}
                            className="bg-orange-50 border-2 border-orange-200 rounded-lg p-2.5 text-xs cursor-pointer hover:bg-orange-100 hover:border-orange-300 transition-all duration-200 active:scale-95"
                          >
                            <p className="font-bold text-orange-800 text-sm">{scheme.scheme_name}</p>
                            <p className="text-gray-600 mt-1 line-clamp-2 text-xs">{scheme.description}</p>
                            <div className="flex gap-1.5 mt-2 flex-wrap">
                              {scheme.category && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                                  📂 {scheme.category}
                                </span>
                              )}
                              {scheme.scheme_type && (
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                                  🏷️ {scheme.scheme_type}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-orange-600 font-medium mt-1.5">
                              {language === 'en' ? '👆 Tap for details' :
                               language === 'te' ? '👆 వివరాలకు నొక్కండి' :
                               '👆 विवरण के लिए टैप करें'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* AVATAR */}
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'bg-primary-orange ml-2 order-1' : 'bg-gradient-to-br from-blue-500 to-purple-600 mr-2 order-2'
                }`}>
                  {message.type === 'user' ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA - OPTIMIZED FOR MOBILE */}
          <div className="p-2.5 bg-white border-t-2 border-gray-100 sm:rounded-b-2xl safe-area-bottom">
            <div className="flex items-center gap-1.5">
              {/* VOICE BUTTON */}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2.5 rounded-full transition flex-shrink-0 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                title={isListening ? 'Stop' : 'Voice'}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              {/* TEXT INPUT */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={
                  language === 'en' ? 'Type message...' :
                  language === 'te' ? 'సందేశం టైప్ చేయండి...' :
                  'संदेश टाइप करें...'
                }
                className="flex-1 px-3 py-2.5 text-sm rounded-xl border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                disabled={isLoading}
              />

              {/* SPEAKER BUTTON */}
              <button
                onClick={isSpeaking ? stopSpeaking : () => {}}
                className={`p-2.5 rounded-full transition flex-shrink-0 ${
                  isSpeaking
                    ? 'bg-yellow-500 hover:bg-yellow-600 animate-pulse'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={!isSpeaking}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>

              {/* SEND BUTTON */}
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="bg-primary-orange hover:bg-primary-darkorange text-white p-2.5 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SCHEME DETAILS MODAL - MOBILE OPTIMIZED */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center">
          <div className="bg-white w-full h-[95vh] sm:h-auto sm:rounded-2xl sm:max-w-3xl sm:max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* STICKY HEADER */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex justify-between items-start z-10">
              <h2 className="text-lg font-bold pr-2 leading-tight">
                {selectedScheme.scheme_name}
              </h2>
              <button 
                onClick={() => setSelectedScheme(null)} 
                className="text-white hover:bg-white/20 rounded-full p-2 transition flex-shrink-0"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* MODAL CONTENT */}
            <div className="p-4 space-y-4">
              {(selectedScheme.category || selectedScheme.scheme_type) && (
                <div className="flex gap-2 flex-wrap">
                  {selectedScheme.category && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-semibold">
                      📂 {selectedScheme.category}
                    </span>
                  )}
                  {selectedScheme.scheme_type && (
                    <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-semibold">
                      🏷️ {selectedScheme.scheme_type}
                    </span>
                  )}
                </div>
              )}
              
              {selectedScheme.description && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-bold text-base mb-2 text-gray-800">
                    📝 {language === 'en' ? 'Description' : language === 'te' ? 'వివరణ' : 'विवरण'}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedScheme.description}</p>
                </div>
              )}
              
              {selectedScheme.eligibility && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <h3 className="font-bold text-base mb-2 text-green-800">
                    ✅ {language === 'en' ? 'Eligibility' : language === 'te' ? 'అర్హత' : 'पात्रता'}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selectedScheme.eligibility}</p>
                </div>
              )}
              
              {selectedScheme.benefits && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-bold text-base mb-2 text-blue-800">
                    🎁 {language === 'en' ? 'Benefits' : language === 'te' ? 'ప్రయోజనాలు' : 'लाभ'}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selectedScheme.benefits}</p>
                </div>
              )}
              
              {selectedScheme.application_process && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h3 className="font-bold text-base mb-2 text-purple-800">
                    📋 {language === 'en' ? 'How to Apply' : language === 'te' ? 'దరఖాస్తు ప్రక్రియ' : 'आवेदन कैसे करें'}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selectedScheme.application_process}</p>
                </div>
              )}
              
              {selectedScheme.official_link && (
                <div className="pt-2 pb-safe">
                  <a
                    href={selectedScheme.official_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center px-4 py-3 rounded-xl text-sm font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg active:scale-95"
                  >
                    🔗 {language === 'en' ? 'Visit Official Website' : language === 'te' ? 'అధికారిక వెబ్‌సైట్‌ని సందర్శించండి' : 'आधिकारिक वेबसाइट पर जाएं'}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

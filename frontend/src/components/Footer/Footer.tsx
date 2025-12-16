import { useLanguage } from '../../utils/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();

  const footerText = {
    en: {
      disclaimer: 'Disclaimer',
      disclaimerText: 'SahayataAI is an independent social service platform and not affiliated with any government organization. All scheme information is sourced from official government websites. Users are advised to verify details on official portals before applying.',
      aboutTitle: 'About SahayataAI',
      aboutText: 'A multilingual platform making government schemes accessible to everyone in English, Telugu, and Hindi.',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      contactText: 'For queries and support, please visit the respective scheme\'s official website.',
      rights: '© 2025 SahayataAI. Built for social welfare.',
      developed: 'Developed with ❤️ for the people of India'
    },
    te: {
      disclaimer: 'నిరాకరణ',
      disclaimerText: 'సహాయతAI ఒక స్వతంత్ర సామాజిక సేవా వేదిక మరియు ఏ ప్రభుత్వ సంస్థతో అనుబంధించబడలేదు. అన్ని పథక సమాచారం అధికారిక ప్రభుత్వ వెబ్‌సైట్‌ల నుండి తీసుకోబడింది.',
      aboutTitle: 'సహాయతAI గురించి',
      aboutText: 'ఆంగ్లం, తెలుగు మరియు హిందీలో ప్రభుత్వ పథకాలను అందరికీ అందుబాటులో ఉంచే బహుభాషా వేదిక.',
      quickLinks: 'శీఘ్ర లింక్‌లు',
      contact: 'సంప్రదించండి',
      contactText: 'ప్రశ్నలు మరియు మద్దతు కోసం, దయచేసి సంబంధిత పథకం యొక్క అధికారిక వెబ్‌సైట్‌ను సందర్శించండి.',
      rights: '© 2025 సహాయతAI. సామాజిక సంక్షేమం కోసం నిర్మించబడింది.',
      developed: 'భారతదేశ ప్రజల కోసం ❤️తో అభివృద్ధి చేయబడింది'
    },
    hi: {
      disclaimer: 'अस्वीकरण',
      disclaimerText: 'सहायताAI एक स्वतंत्र सामाजिक सेवा मंच है और किसी भी सरकारी संगठन से संबद्ध नहीं है। सभी योजना जानकारी आधिकारिक सरकारी वेबसाइटों से ली गई है।',
      aboutTitle: 'सहायताAI के बारे में',
      aboutText: 'अंग्रेजी, तेलुगु और हिंदी में सरकारी योजनाओं को सभी के लिए सुलभ बनाने वाला बहुभाषी मंच।',
      quickLinks: 'त्वरित लिंक',
      contact: 'संपर्क करें',
      contactText: 'प्रश्नों और सहायता के लिए, कृपया संबंधित योजना की आधिकारिक वेबसाइट पर जाएं।',
      rights: '© 2025 सहायताAI। सामाजिक कल्याण के लिए निर्मित।',
      developed: 'भारत के लोगों के लिए ❤️ के साथ विकसित'
    }
  };

  const t = footerText[language];

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white mt-20">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/ashoka-emblem.png" 
                alt="Ashoka Emblem" 
                className="w-12 h-12 object-contain"
              />
              <h3 className="text-2xl font-bold">
                <span className="text-white">Sahayata</span>
                <span className="text-primary-orange">AI</span>
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              {t.aboutText}
            </p>
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold">
                English
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold">
                తెలుగు
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold">
                हिंदी
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-primary-orange">{t.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-orange transition inline-flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  India.gov.in
                </a>
              </li>
              <li>
                <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-orange transition inline-flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  MyScheme Portal
                </a>
              </li>
              <li>
                <a href="https://www.ap.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-orange transition inline-flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  AP Government
                </a>
              </li>
              <li>
                <a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-orange transition inline-flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Digital India
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-primary-orange">{t.contact}</h4>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {t.contactText}
            </p>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <p className="text-xs text-gray-400 mb-2">
                <strong className="text-primary-orange">{t.disclaimer}:</strong>
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t.disclaimerText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-400">{t.rights}</p>
            <p className="text-gray-400">{t.developed}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

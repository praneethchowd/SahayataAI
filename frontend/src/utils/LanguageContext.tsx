import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'te' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: {
    [key: string]: string;
  };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    appName: 'Sahayata',
    appNameAI: 'AI',
    search: 'Search for schemes...',
    signIn: 'Sign In',
    checkEligibility: 'Check Eligibility',
    totalSchemes: 'Total Schemes',
    apSchemes: 'AP Govt Schemes',
    centralSchemes: 'Central Govt Schemes',
    findSchemes: 'Find schemes based on categories',
  },
  te: {
    appName: 'సహాయత',
    appNameAI: 'AI',
    search: 'పథకాల కోసం వెతకండి...',
    signIn: 'సైన్ ఇన్',
    checkEligibility: 'అర్హత తనిఖీ చేయండి',
    totalSchemes: 'మొత్తం పథకాలు',
    apSchemes: 'AP ప్రభుత్వ పథకాలు',
    centralSchemes: 'కేంద్ర ప్రభుత్వ పథకాలు',
    findSchemes: 'వర్గాల ఆధారంగా పథకాలను కనుగొనండి',
  },
  hi: {
    appName: 'सहायता',
    appNameAI: 'AI',
    search: 'योजनाओं के लिए खोजें...',
    signIn: 'साइन इन',
    checkEligibility: 'पात्रता जांचें',
    totalSchemes: 'कुल योजनाएं',
    apSchemes: 'AP सरकार की योजनाएं',
    centralSchemes: 'केंद्र सरकार की योजनाएं',
    findSchemes: 'श्रेणियों के आधार पर योजनाएं खोजें',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = {
    language,
    setLanguage,
    translations: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

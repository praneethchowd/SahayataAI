import { useState, useEffect } from 'react';
import { getSchemeDetails } from '../../api/api';
import { useLanguage } from '../../utils/LanguageContext';

interface SchemeDetailsProps {
  schemeId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

interface SchemeData {
  id: number;
  scheme_name_en: string;
  scheme_name_te: string;
  scheme_name_hi: string;
  description_en: string;
  description_te: string;
  description_hi: string;
  eligibility_en: string;
  eligibility_te: string;
  eligibility_hi: string;
  benefits_en: string;
  benefits_te: string;
  benefits_hi: string;
  application_process_en: string;
  application_process_te: string;
  application_process_hi: string;
  official_link: string;
  beneficiary_tags: string;
  scheme_type: string;
  category: string;
}

const SchemeDetails = ({ schemeId, isOpen, onClose }: SchemeDetailsProps) => {
  const { language } = useLanguage();
  const [scheme, setScheme] = useState<SchemeData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (schemeId && isOpen) {
      fetchSchemeDetails();
    }
  }, [schemeId, isOpen]);

  const fetchSchemeDetails = async () => {
    if (!schemeId) return;
    
    setLoading(true);
    try {
      const response = await getSchemeDetails(schemeId);
      setScheme(response.scheme);
    } catch (error) {
      console.error('Error fetching scheme details:', error);
      alert('Failed to load scheme details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !schemeId) return null;

  const getSchemeName = () => {
    if (!scheme) return '';
    return language === 'en' ? scheme.scheme_name_en :
           language === 'te' ? scheme.scheme_name_te :
           scheme.scheme_name_hi;
  };

  const getDescription = () => {
    if (!scheme) return '';
    return language === 'en' ? scheme.description_en :
           language === 'te' ? scheme.description_te :
           scheme.description_hi;
  };

  const getEligibility = () => {
    if (!scheme) return '';
    return language === 'en' ? scheme.eligibility_en :
           language === 'te' ? scheme.eligibility_te :
           scheme.eligibility_hi;
  };

  const getBenefits = () => {
    if (!scheme) return '';
    return language === 'en' ? scheme.benefits_en :
           language === 'te' ? scheme.benefits_te :
           scheme.benefits_hi;
  };

  const getApplicationProcess = () => {
    if (!scheme) return '';
    return language === 'en' ? scheme.application_process_en :
           language === 'te' ? scheme.application_process_te :
           scheme.application_process_hi;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-orange mb-4"></div>
            <p className="text-gray-600 font-medium">Loading scheme details...</p>
          </div>
        ) : scheme ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-orange to-orange-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-bold mb-2">{getSchemeName()}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                      {scheme.category}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                      {scheme.scheme_type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition flex-shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'Description' : language === 'te' ? 'వివరణ' : 'विवरण'}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-xl">
                  {getDescription()}
                </p>
              </section>

              {/* Eligibility */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-green-100 rounded-lg p-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'Eligibility Criteria' : language === 'te' ? 'అర్హత ప్రమాణాలు' : 'पात्रता मानदंड'}
                  </h3>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {getEligibility()}
                  </p>
                </div>
              </section>

              {/* Benefits */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-purple-100 rounded-lg p-2">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'Benefits' : language === 'te' ? 'ప్రయోజనాలు' : 'लाभ'}
                  </h3>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {getBenefits()}
                  </p>
                </div>
              </section>

              {/* Application Process */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-orange-100 rounded-lg p-2">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {language === 'en' ? 'How to Apply' : language === 'te' ? 'ఎలా దరఖాస్తు చేసుకోవాలి' : 'आवेदन कैसे करें'}
                  </h3>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {getApplicationProcess()}
                  </p>
                </div>
              </section>

              {/* Beneficiary Tags */}
              {scheme.beneficiary_tags && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-cyan-100 rounded-lg p-2">
                      <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {language === 'en' ? 'Target Beneficiaries' : language === 'te' ? 'లక్ష్య లబ్ధిదారులు' : 'लक्षित लाभार्थी'}
                    </h3>
                  </div>
                  <div className="bg-cyan-50 p-4 rounded-xl">
                    <p className="text-gray-700">
                      {scheme.beneficiary_tags}
                    </p>
                  </div>
                </section>
              )}

              {/* Official Link */}
              {scheme.official_link && (
                <div className="bg-gradient-to-r from-primary-orange to-orange-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg mb-1">
                        {language === 'en' ? 'Ready to Apply?' : language === 'te' ? 'దరఖాస్తు చేయడానికి సిద్ధంగా ఉన్నారా?' : 'आवेदन करने के लिए तैयार हैं?'}
                      </h4>
                      <p className="text-orange-100 text-sm">
                        {language === 'en' ? 'Visit the official website for more details' : 
                         language === 'te' ? 'మరిన్ని వివరాల కోసం అధికారిక వెబ్‌సైట్‌ని సందర్శించండి' : 
                         'अधिक जानकारी के लिए आधिकारिक वेबसाइट पर जाएं'}
                      </p>
                    </div>
                    <a
                      href={scheme.official_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-primary-orange px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition inline-flex items-center gap-2 shadow-lg"
                    >
                      {language === 'en' ? 'Visit Website' : language === 'te' ? 'వెబ్‌సైట్ సందర్శించండి' : 'वेबसाइट पर जाएं'}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SchemeDetails;

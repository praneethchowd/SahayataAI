import { useState } from 'react';
import { checkEligibility } from '../../api/api';
import { useLanguage } from '../../utils/LanguageContext';

interface EligibilityCheckerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EligibilityCriteria {
  gender?: string;
  age?: number;
  occupation?: string;
  location?: string;
  caste?: string;
  disability?: boolean;
  minority?: boolean;
  annual_income?: number;
}

const EligibilityChecker = ({ isOpen, onClose }: EligibilityCheckerProps) => {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [criteria, setCriteria] = useState<EligibilityCriteria>({
    gender: '',
    age: undefined,
    occupation: '',
    location: '',
    caste: '',
    disability: false,
    minority: false,
    annual_income: undefined,
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await checkEligibility(criteria);
      setResults(response.eligible_schemes);
      setShowResults(true);
    } catch (error) {
      console.error('Eligibility check error:', error);
      alert('Error checking eligibility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCriteria({
      gender: '',
      age: undefined,
      occupation: '',
      location: '',
      caste: '',
      disability: false,
      minority: false,
      annual_income: undefined,
    });
    setStep(1);
    setShowResults(false);
    setResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {showResults ? 'Your Eligible Schemes' : 'Check Eligibility'}
            </h2>
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {!showResults && (
            <p className="text-orange-100 mt-2">Step {step} of 3 - Tell us about yourself</p>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {!showResults ? (
            <>
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Male', 'Female', 'Other'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setCriteria({ ...criteria, gender: g })}
                          className={`py-3 px-4 rounded-xl font-semibold transition ${
                            criteria.gender === g
                              ? 'bg-primary-orange text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={criteria.age || ''}
                      onChange={(e) => setCriteria({ ...criteria, age: parseInt(e.target.value) })}
                      placeholder="Enter your age"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Urban', 'Rural'].map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setCriteria({ ...criteria, location: loc })}
                          className={`py-3 px-4 rounded-xl font-semibold transition ${
                            criteria.location === loc
                              ? 'bg-primary-orange text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Occupation & Income */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Occupation
                    </label>
                    <select
                      value={criteria.occupation}
                      onChange={(e) => setCriteria({ ...criteria, occupation: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                    >
                      <option value="">Select occupation</option>
                      <option value="Farmer">Farmer</option>
                      <option value="Student">Student</option>
                      <option value="Self Employed">Self Employed</option>
                      <option value="Employed">Employed</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Annual Income (₹)
                    </label>
                    <input
                      type="number"
                      value={criteria.annual_income || ''}
                      onChange={(e) => setCriteria({ ...criteria, annual_income: parseInt(e.target.value) })}
                      placeholder="Enter annual income"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={criteria.caste}
                      onChange={(e) => setCriteria({ ...criteria, caste: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                    >
                      <option value="">Select category</option>
                      <option value="General">General</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="OBC">OBC</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Info */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-800 mb-4">
                      Select if any of these apply to you:
                    </p>
                    
                    <label className="flex items-center space-x-3 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criteria.disability}
                        onChange={(e) => setCriteria({ ...criteria, disability: e.target.checked })}
                        className="w-5 h-5 text-primary-orange rounded focus:ring-primary-orange"
                      />
                      <span className="text-gray-700 font-medium">Person with Disability</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criteria.minority}
                        onChange={(e) => setCriteria({ ...criteria, minority: e.target.checked })}
                        className="w-5 h-5 text-primary-orange rounded focus:ring-primary-orange"
                      />
                      <span className="text-gray-700 font-medium">Minority Community</span>
                    </label>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-green-800">
                      ✓ We'll find all government schemes you're eligible for based on your profile
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                  >
                    ← Previous
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && (!criteria.gender || !criteria.age)}
                    className="px-6 py-3 bg-primary-orange text-white rounded-xl font-semibold hover:bg-primary-darkorange transition disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 ml-auto flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Checking...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Check Eligibility
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Results Display */
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <p className="text-lg font-bold text-green-800">
                  🎉 Found {results.length} schemes for you!
                </p>
              </div>

              {results.map((scheme, index) => (
  <div
    key={index}
    className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary-orange transition cursor-pointer bg-white shadow-sm hover:shadow-md"
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="font-bold text-lg text-gray-800 flex-1">
        {language === 'en' ? scheme.scheme_name_en : 
         language === 'te' ? scheme.scheme_name_te : 
         scheme.scheme_name_hi}
      </h3>
      {scheme.relevance_score && scheme.relevance_score > 50 && (
        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full ml-2">
          ⭐ Highly Relevant
        </span>
      )}
    </div>
    
    <div className="flex items-center gap-2 mb-3">
      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
        {scheme.category}
      </span>
      <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
        {scheme.scheme_type}
      </span>
    </div>
    
    {scheme.beneficiary_tags && (
      <p className="text-xs text-gray-500 mt-2">
        <strong>For:</strong> {scheme.beneficiary_tags.substring(0, 100)}...
      </p>
    )}
  </div>
))}


              <button
                onClick={resetForm}
                className="w-full py-3 bg-primary-orange text-white rounded-xl font-bold hover:bg-primary-darkorange transition"
              >
                Check Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityChecker;

import { useState } from 'react';
import { login, signup } from '../../api/api';
import { useLanguage } from '../../utils/LanguageContext';

export interface User {
  id: number;
  name: string;
  username: string;
  mobile: string;
  dob: string;
  gender: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}


const AuthModal = ({ isOpen, onClose, onAuthSuccess }: AuthModalProps) => {
  const { language } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign Up Form State
  const [signupData, setSignupData] = useState({
    name: '',
    mobile: '',
    dob: '',
    gender: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Sign In Form State
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(signupData.mobile)) {
      setError('Invalid mobile number. Must be 10 digits starting with 6-9');
      return;
    }

    setLoading(true);
    try {
      const response = await signup({
        name: signupData.name,
        mobile: signupData.mobile,
        dob: signupData.dob,
        gender: signupData.gender,
        username: signupData.username,
        password: signupData.password
      });

      if (response.success) {
        onAuthSuccess(response.user);
        onClose();
        resetForms();
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginData.username || !loginData.password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await login(loginData);

      if (response.success) {
        onAuthSuccess(response.user);
        onClose();
        resetForms();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setSignupData({
      name: '',
      mobile: '',
      dob: '',
      gender: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
    setLoginData({
      username: '',
      password: ''
    });
    setError('');
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-orange to-orange-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isSignUp ? (language === 'en' ? 'Create Account' : language === 'te' ? 'ఖాతా సృష్టించండి' : 'खाता बनाएं') : (language === 'en' ? 'Sign In' : language === 'te' ? 'సైన్ ఇన్' : 'साइन इन')}
            </h2>
            <button
              onClick={() => {
                onClose();
                resetForms();
              }}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {isSignUp ? (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Full Name' : language === 'te' ? 'పూర్తి పేరు' : 'पूरा नाम'} *
                </label>
                <input
                  type="text"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Mobile Number' : language === 'te' ? 'మొబైల్ నంబర్' : 'मोबाइल नंबर'} *
                </label>
                <input
                  type="tel"
                  value={signupData.mobile}
                  onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value })}
                  required
                  pattern="[6-9][0-9]{9}"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {language === 'en' ? 'Date of Birth' : language === 'te' ? 'పుట్టిన తేదీ' : 'जन्म तिथि'} *
                  </label>
                  <input
                    type="date"
                    value={signupData.dob}
                    onChange={(e) => setSignupData({ ...signupData, dob: e.target.value })}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {language === 'en' ? 'Gender' : language === 'te' ? 'లింగం' : 'लिंग'} *
                  </label>
                  <select
                    value={signupData.gender}
                    onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Username' : language === 'te' ? 'యూజర్‌నేమ్' : 'उपयोगकर्ता नाम'} *
                </label>
                <input
                  type="text"
                  value={signupData.username}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                  required
                  minLength={3}
                  pattern="[a-zA-Z0-9_]+"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Password' : language === 'te' ? 'పాస్‌వర్డ్' : 'पासवर्ड'} *
                </label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Confirm Password' : language === 'te' ? 'పాస్‌వర్డ్ నిర్ధారించండి' : 'पासवर्ड की पुष्टि करें'} *
                </label>
                <input
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                  placeholder="Re-enter password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-orange hover:bg-primary-darkorange text-white py-3 rounded-lg font-bold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    {language === 'en' ? 'Creating Account...' : language === 'te' ? 'ఖాతా సృష్టిస్తోంది...' : 'खाता बनाया जा रहा है...'}
                  </>
                ) : (
                  language === 'en' ? 'Create Account' : language === 'te' ? 'ఖాతా సృష్టించండి' : 'खाता बनाएं'
                )}
              </button>
            </form>
          ) : (
            /* Sign In Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Username' : language === 'te' ? 'యూజర్‌నేమ్' : 'उपयोगकर्ता नाम'}
                </label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Password' : language === 'te' ? 'పాస్‌వర్డ్' : 'पासवर्ड'}
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-orange hover:bg-primary-darkorange text-white py-3 rounded-lg font-bold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    {language === 'en' ? 'Signing In...' : language === 'te' ? 'సైన్ ఇన్ అవుతోంది...' : 'साइन इन हो रहा है...'}
                  </>
                ) : (
                  language === 'en' ? 'Sign In' : language === 'te' ? 'సైన్ ఇన్' : 'साइन इन'
                )}
              </button>
            </form>
          )}

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={switchMode}
              className="text-primary-orange hover:text-primary-darkorange font-semibold transition"
            >
              {isSignUp ? (
                language === 'en' ? 'Already have an account? Sign In' :
                language === 'te' ? 'ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్' :
                'पहले से खाता है? साइन इन करें'
              ) : (
                language === 'en' ? "Don't have an account? Sign Up" :
                language === 'te' ? 'ఖాతా లేదా? సైన్ అప్ చేయండి' :
                'खाता नहीं है? साइन अप करें'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

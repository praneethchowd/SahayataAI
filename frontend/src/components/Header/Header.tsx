import { useState } from 'react';
import { useLanguage } from '../../utils/LanguageContext';
import { searchSchemes } from '../../api/api';

interface User {
  id?: number;
  name: string;
  username: string;
  mobile: string;
  dob?: string;
  gender?: string;
}

interface HeaderProps {
  onSchemeClick?: (schemeId: number) => void;
  onSignInClick?: () => void;
  user?: User | null;
  onLogout?: () => void;
}

const Header = ({ onSchemeClick, onSignInClick, user, onLogout }: HeaderProps) => {
  const { language, setLanguage, translations } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const response = await searchSchemes(searchQuery, language);
        setSearchResults(response.schemes);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        alert('Search failed. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return user.name.substring(0, 2);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50 shadow-lg border-b-4 border-primary-orange">
        {/* Tri-color stripe */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
        
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Logo with Ashoka Emblem */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <img 
                src="/ashoka-emblem.png" 
                alt="Ashoka Emblem" 
                className="w-16 h-16 object-contain drop-shadow-md"
              />
              <div className="border-l-2 border-gray-300 pl-4">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  <span className="text-gray-800">Sahayata</span>
                  <span className="text-primary-orange">AI</span>
                </h1>
                <p className="text-xs text-gray-600 font-medium">Government Schemes Portal</p>
              </div>
            </div>

            {/* Center: Compact Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={translations.search}
                  className="w-full px-5 py-3 pr-12 rounded-xl bg-white border-2 border-gray-200 text-gray-900 text-sm font-medium placeholder-gray-500 focus:outline-none focus:border-primary-orange focus:bg-white shadow-sm transition"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-orange text-white p-2.5 rounded-lg hover:bg-primary-darkorange transition disabled:opacity-50 shadow-md"
                >
                  {isSearching ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            {/* Right: Language Selector & User Profile/Sign In */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Language Selector */}
              <div className="hidden md:flex gap-2 bg-gray-100 rounded-xl p-1.5">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    language === 'en' 
                      ? 'bg-primary-orange text-white shadow-md' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('te')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    language === 'te' 
                      ? 'bg-primary-orange text-white shadow-md' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  తెలుగు
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    language === 'hi' 
                      ? 'bg-primary-orange text-white shadow-md' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* User Profile or Sign In */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 bg-white border-2 border-primary-orange rounded-xl px-4 py-2 hover:bg-orange-50 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-orange to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                      {getUserInitials()}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-bold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                    <svg className={`w-4 h-4 text-gray-600 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.mobile}</p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                      
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">My Profile</span>
                      </button>

                      <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Saved Schemes</span>
                      </button>

                      <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Application History</span>
                      </button>

                      <div className="border-t border-gray-100 mt-2"></div>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center gap-3 text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-sm font-bold">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={onSignInClick}
                  className="bg-primary-orange hover:bg-primary-darkorange text-white px-6 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {translations.signIn}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Results Modal - Same as before */}
      {showResults && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Search Results</h2>
                  <p className="text-blue-100 mt-1">
                    Found {searchResults.length} schemes for "{searchQuery}"
                  </p>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No schemes found</h3>
                  <p className="text-gray-500">Try different keywords or check spelling</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((scheme) => (
                    <div
                      key={scheme.id}
                      onClick={() => {
                        if (onSchemeClick) {
                          onSchemeClick(scheme.id);
                          setShowResults(false);
                        }
                      }}
                      className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary-orange transition cursor-pointer bg-white shadow-sm hover:shadow-lg group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-primary-orange transition">
                            {language === 'en' ? scheme.scheme_name_en :
                             language === 'te' ? scheme.scheme_name_te :
                             scheme.scheme_name_hi}
                          </h3>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                              {scheme.category}
                            </span>
                            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                              {scheme.scheme_type}
                            </span>
                          </div>
                        </div>

                        <svg className="w-6 h-6 text-gray-400 group-hover:text-primary-orange transition flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>

                      {scheme.official_link && (
                        <a
                          href={scheme.official_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                        >
                          Official Website
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-b-2xl border-t">
                <p className="text-sm text-gray-600 text-center">
                  💡 Click on any scheme to see full details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

import { useLanguage } from '../../utils/LanguageContext';

interface Scheme {
  id: number;
  scheme_name_en: string;
  scheme_name_te: string;
  scheme_name_hi: string;
  category: string;
  scheme_type: string;
  official_link: string;
}

interface SearchResultsProps {
  results: Scheme[];
  query: string;
  onClose: () => void;
  onSchemeClick: (schemeId: number) => void;
}

const SearchResults = ({ results, query, onClose, onSchemeClick }: SearchResultsProps) => {
  const { language } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Search Results</h2>
              <p className="text-blue-100 mt-1">
                Found {results.length} schemes for "{query}"
              </p>
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
        </div>

        {/* Results */}
        <div className="p-6">
          {results.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No schemes found</h3>
              <p className="text-gray-500">Try different keywords or check spelling</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((scheme) => (
                <div
                  key={scheme.id}
                  onClick={() => onSchemeClick(scheme.id)}
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

        {/* Footer */}
        {results.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-b-2xl border-t">
            <p className="text-sm text-gray-600 text-center">
              💡 Click on any scheme to see full details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

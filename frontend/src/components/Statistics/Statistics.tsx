import { useState, useEffect } from 'react';
import { getStatistics } from '../../api/api';
import { useLanguage } from '../../utils/LanguageContext';

interface StatisticsData {
  total_schemes: number;
  ap_schemes: number;
  central_schemes: number;
  categories: { name: string; count: number }[];
}

const Statistics = () => {
  const { translations } = useLanguage();
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStatistics();
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-orange"></div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {/* Total Schemes Card */}
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 className="text-5xl font-extrabold text-blue-600 mb-2">{stats.total_schemes}</h3>
          <p className="text-lg font-semibold text-blue-800">{translations.totalSchemes}</p>
          <p className="text-sm text-blue-600 mt-2">All available schemes</p>
        </div>
      </div>

      {/* AP Schemes Card */}
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 className="text-5xl font-extrabold text-green-600 mb-2">{stats.ap_schemes}</h3>
          <p className="text-lg font-semibold text-green-800">{translations.apSchemes}</p>
          <p className="text-sm text-green-600 mt-2">State Government</p>
        </div>
      </div>

      {/* Central Schemes Card */}
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <h3 className="text-5xl font-extrabold text-orange-600 mb-2">{stats.central_schemes}</h3>
          <p className="text-lg font-semibold text-orange-800">{translations.centralSchemes}</p>
          <p className="text-sm text-orange-600 mt-2">Central Government</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

import { useState, useEffect } from 'react';
import { getStatistics } from '../../api/api';
import { useLanguage } from '../../utils/LanguageContext';
import React from 'react';


interface Category {
  name: string;
  count: number;
  icon: React.ReactElement;
  gradient: string;
}

const Categories = () => {
  const { translations } = useLanguage();
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Define category icons and styles
  const categoryConfig: { [key: string]: { icon: React.ReactElement; gradient: string } } = {
    'Social welfare & Empowerment': {
      icon: (
        <svg className="w-20 h-20 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      gradient: 'from-orange-400 via-orange-300 to-orange-200'
    },
    'Agriculture, Rural & Environment': {
      icon: (
        <svg className="w-20 h-20 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
      ),
      gradient: 'from-green-400 via-green-300 to-green-200'
    },
    'Education & Learning': {
      icon: (
        <svg className="w-20 h-20 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
      gradient: 'from-blue-400 via-blue-300 to-blue-200'
    },
    'Women and Child': {
      icon: (
        <svg className="w-20 h-20 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      gradient: 'from-pink-400 via-pink-300 to-pink-200'
    },
    'Transport & Infrastructure': {
      icon: (
        <svg className="w-20 h-20 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
        </svg>
      ),
      gradient: 'from-gray-400 via-gray-300 to-gray-200'
    },
    'Business & Entrepreneurship': {
      icon: (
        <svg className="w-20 h-20 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      gradient: 'from-yellow-400 via-yellow-300 to-yellow-200'
    },
    'Health & Wellness': {
      icon: (
        <svg className="w-20 h-20 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
      gradient: 'from-red-400 via-red-300 to-red-200'
    },
    'Skills & Employment': {
      icon: (
        <svg className="w-20 h-20 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      ),
      gradient: 'from-purple-400 via-purple-300 to-purple-200'
    },
    'Housing & Shelter': {
      icon: (
        <svg className="w-20 h-20 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      gradient: 'from-indigo-400 via-indigo-300 to-indigo-200'
    },
    'Banking, Financial Services and Insurance': {
      icon: (
        <svg className="w-20 h-20 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      ),
      gradient: 'from-cyan-400 via-cyan-300 to-cyan-200'
    },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getStatistics();
        setCategoriesData(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-orange"></div>
      </div>
    );
  }

  const categories: Category[] = categoriesData.map((cat: any) => ({
    name: cat.name,
    count: cat.count,
    icon: categoryConfig[cat.name]?.icon || categoryConfig['Social welfare & Empowerment'].icon,
    gradient: categoryConfig[cat.name]?.gradient || 'from-gray-400 via-gray-300 to-gray-200',
  }));

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          {translations.findSchemes}
        </h2>
        <div className="w-24 h-1 bg-primary-orange mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer group overflow-hidden"
          >
            <div className={`bg-gradient-to-br ${category.gradient} p-8 flex items-center justify-center min-h-[160px] relative overflow-hidden`}>
              {/* Decorative circles in background */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/20 rounded-full -ml-8 -mb-8"></div>
              
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
            </div>
            <div className="p-5 text-center bg-white">
              <p className="text-4xl font-extrabold text-primary-orange mb-2">
                {category.count}
              </p>
              <p className="text-sm font-semibold text-gray-700 leading-tight px-2 line-clamp-2">
                {category.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;

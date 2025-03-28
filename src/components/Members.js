import React from 'react';
import { FiFlag } from 'react-icons/fi'; // Removed unused FiChevronRight

const Members = () => {
  const memberCountries = [
    { name: 'Angola', code: 'ao' },
    { name: 'Cameroon', code: 'cm' },
    { name: 'Central African Republic', code: 'cf' },
    { name: 'Côte d\'Ivoire', code: 'ci' },
    { name: 'Democratic Republic of the Congo', code: 'cd' },
    { name: 'Ghana', code: 'gh' },
    { name: 'Guinea', code: 'gn' },
    { name: 'Liberia', code: 'lr' },
    { name: 'Namibia', code: 'na' },
    { name: 'Republic of the Congo', code: 'cg' },
    { name: 'Sierra Leone', code: 'sl' },
    { name: 'South Africa', code: 'za' },
    { name: 'Tanzania', code: 'tz' },
    { name: 'Togo', code: 'tg' },
    { name: 'Zimbabwe', code: 'zw' }
  ];

  const observerCountries = [
    { name: 'Algeria', code: 'dz' },
    { name: 'Mali', code: 'ml' },
    { name: 'Mauritania', code: 'mr' },
    { name: 'Gabon', code: 'ga' },
    { name: 'Russian Federation', code: 'ru' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Page Header with Decorative Elements */}
      <div className="text-center mb-20 relative">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 font-serif tracking-tight">
          ADPA Membership
        </h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-xl text-gray-600 leading-relaxed">
            Uniting African diamond-producing nations to foster sustainable development and ethical practices in the diamond industry
          </p>
        </div>
      </div>

      {/* Membership Cards with Hover Effects */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {/* Member Countries Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <div className="flex items-center">
              <FiFlag className="text-white text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-white">Member Countries</h2>
            </div>
          </div>
          <div className="p-8">
            <p className="text-gray-700 mb-8 leading-relaxed border-b border-gray-100 pb-6">
              Full member states are African diamond-producing countries that have ratified the ADPA Statute and comply with the Kimberley Process Certification Scheme requirements.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {memberCountries.map((country) => (
                <div 
                  key={country.code} 
                  className="flex items-center py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <img 
                    src={`https://flagcdn.com/24x18/${country.code}.png`} 
                    alt={`${country.name} flag`}
                    className="w-6 h-4.5 mr-3 rounded-sm shadow-sm"
                    loading="lazy"
                  />
                  <span className="text-gray-800 font-medium">{country.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Observer Countries Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-8 py-6">
            <div className="flex items-center">
              <FiFlag className="text-white text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-white">Observer Countries</h2>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-4 mb-8 border-b border-gray-100 pb-6">
              <p className="text-gray-700 leading-relaxed">
                Observer status is available to African nations with diamond potential and non-African entities involved in the diamond value chain.
              </p>
            </div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Current Observers:</h3>
            <div className="space-y-3">
              {observerCountries.map((country) => (
                <div 
                  key={country.code} 
                  className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <img 
                    src={`https://flagcdn.com/24x18/${country.code}.png`} 
                    alt={`${country.name} flag`}
                    className="w-6 h-4.5 mr-3 rounded-sm shadow-sm"
                    loading="lazy"
                  />
                  <span className="text-gray-800 font-medium">{country.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Interested in Membership?</h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Learn more about the benefits of ADPA membership and the application process
        </p>
        <button className="bg-blue-800 hover:bg-blue-700 text-black font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
          Contact the Executive Directorate
        </button>
      </div>
    </div>
  );
};

export default Members;
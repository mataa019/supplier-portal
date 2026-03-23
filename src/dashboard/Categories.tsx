import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CakeIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  PaperAirplaneIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

import { fetchSupplierCategories, SupplierCategory } from '../apiservice/Apiservice';
import LoadingOverlay from '../component/LoadingOverlay';

// Icon mapping for dynamic assignment
const iconMap: Record<string, any> = {
  'computers': ComputerDesktopIcon,
  'office': DocumentTextIcon,
  'security': ShieldCheckIcon,
  'cleaning': SparklesIcon,
  'catering': CakeIcon,
  'building': BuildingOfficeIcon,
};


export default function Categories() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<SupplierCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchSupplierCategories();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (categoryId: string) => {
    navigate(`/dashboard/apply?category=${categoryId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {loading && <LoadingOverlay message="Loading categories..." />}
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Supplier Categories</h1>
        <p className="text-sm text-gray-500 mt-1">Select a category to begin your application</p>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-center">
          {error}
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          // Try to pick an icon based on name or fallback
          let iconKey = category.name.toLowerCase().split(' ')[0];
          let Icon = iconMap[iconKey] || BuildingOfficeIcon;
          // Parse requirements (API returns as comma-separated string)
          const requirements = category.Requirements.split(',').map(r => r.trim());
          return (
            <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.id}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-500">Application Fee</span>
                <span className="text-sm font-semibold text-gray-900">K{category.applicationFee.toLocaleString()}</span>
              </div>
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Requirements ({requirements.length})</p>
                <ul className="space-y-1">
                  {requirements.slice(0, 3).map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-gray-400" />
                      {req}
                    </li>
                  ))}
                  {requirements.length > 3 && (
                    <li className="text-xs text-gray-400">+{requirements.length - 3} more</li>
                  )}
                </ul>
              </div>
              <button
                onClick={() => handleApply(category.id)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Apply Now
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && !loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <MagnifyingGlassIcon className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search terms</p>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-8">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Important Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Application Process</h3>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-5 h-5 bg-gray-900 text-white rounded-full text-xs">1</span>
                Select your desired category
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-5 h-5 bg-gray-900 text-white rounded-full text-xs">2</span>
                Download and complete the application form
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-5 h-5 bg-gray-900 text-white rounded-full text-xs">3</span>
                Upload all required documents
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-5 h-5 bg-gray-900 text-white rounded-full text-xs">4</span>
                Pay the application fee
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-5 h-5 bg-gray-900 text-white rounded-full text-xs">5</span>
                Submit your application for review
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Processing Time</h3>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                Standard processing: 10-15 business days
              </li>
              <li className="flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                Applications are reviewed in order received
              </li>
              <li className="flex items-center gap-2">
                <PaperAirplaneIcon className="w-4 h-4 text-gray-500" />
                You will be notified via email of any updates
              </li>
              <li className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
                Incomplete applications may be delayed
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

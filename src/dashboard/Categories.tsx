import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  WrenchScrewdriverIcon,
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

const categories = [
  {
    id: 'CAT-001',
    name: 'Construction Materials',
    description: 'Supply of building materials including cement, steel, aggregates, and finishing materials.',
    fee: 'K2,500',
    icon: BuildingOfficeIcon,
    requirements: [
      'Business Registration Certificate',
      'Tax Compliance Certificate',
      'Financial Statements (2 years)',
      'Product Catalog',
      'Quality Certifications',
    ],
  },
  {
    id: 'CAT-002',
    name: 'Office Supplies',
    description: 'Provision of office stationery, furniture, and equipment for daily operations.',
    fee: 'K1,500',
    icon: DocumentTextIcon,
    requirements: [
      'Business Registration Certificate',
      'Tax Compliance Certificate',
      'Product Price List',
      'Delivery Capacity Proof',
    ],
  },
  {
    id: 'CAT-003',
    name: 'IT Equipment & Services',
    description: 'Supply of computers, networking equipment, software, and IT support services.',
    fee: 'K3,000',
    icon: ComputerDesktopIcon,
    requirements: [
      'Business Registration Certificate',
      'Tax Compliance Certificate',
      'Technical Certifications',
      'Partnership/Distributor Agreements',
      'Service Level Agreement Template',
    ],
  },
  {
    id: 'CAT-004',
    name: 'Cleaning Services',
    description: 'Professional cleaning and janitorial services for office and industrial spaces.',
    fee: 'K1,000',
    icon: SparklesIcon,
    requirements: [
      'Business Registration Certificate',
      'Tax Compliance Certificate',
      'Staff List & Qualifications',
      'Equipment Inventory',
    ],
  },
  {
    id: 'CAT-005',
    name: 'Security Services',
    description: 'Provision of security personnel, surveillance systems, and risk management.',
    fee: 'K2,000',
    icon: ShieldCheckIcon,
    requirements: [
      'Business Registration Certificate',
      'Tax Compliance Certificate',
      'Security License',
      'Insurance Certificate',
      'Staff Clearance Documents',
    ],
  },
  {
    id: 'CAT-006',
    name: 'Catering Services',
    description: 'Food and beverage catering for events, meetings, and daily staff meals.',
    fee: 'K1,500',
    icon: CakeIcon,
    requirements: [
      'Business Registration Certificate',
      'Tax Compliance Certificate',
      'Health & Safety Certification',
      'Food Handler Certificates',
      'Sample Menu & Pricing',
    ],
  },
];

export default function Categories() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <category.icon className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.id}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500">Application Fee</span>
              <span className="text-sm font-semibold text-gray-900">{category.fee}</span>
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Requirements ({category.requirements.length})</p>
              <ul className="space-y-1">
                {category.requirements.slice(0, 3).map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-gray-400" />
                    {req}
                  </li>
                ))}
                {category.requirements.length > 3 && (
                  <li className="text-xs text-gray-400">+{category.requirements.length - 3} more</li>
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
        ))}
      </div>

      {filteredCategories.length === 0 && (
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

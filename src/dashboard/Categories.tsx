import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CategoryCard } from '../component/cards';
import TextInput from '../component/TextInput';

const categories = [
  {
    id: 'CAT-001',
    name: 'Construction Materials',
    description: 'Supply of building materials including cement, steel, aggregates, and finishing materials.',
    fee: 'K2,500',
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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Supplier Categories</h1>
        <p className="text-gray-600">Select a category to begin your application</p>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <TextInput
          id="search"
          label=""
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories..."
        />
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            {...category}
            onApply={handleApply}
          />
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No categories found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </Card>
      )}

      {/* Info Section */}
      <Card className="p-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Important Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Application Process</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>1. Select your desired category</li>
              <li>2. Download and complete the application form</li>
              <li>3. Upload all required documents</li>
              <li>4. Pay the application fee</li>
              <li>5. Submit your application for review</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Processing Time</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Standard processing: 10-15 business days</li>
              <li>• Applications are reviewed in order received</li>
              <li>• You will be notified via email of any updates</li>
              <li>• Incomplete applications may be delayed</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

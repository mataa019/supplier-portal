import { Link } from 'react-router-dom';
import { Card, StatCard, ApplicationCard } from '../component/cards';

const stats = [
  { title: 'Total Applications', value: 3, icon: '📋' },
  { title: 'Pending Review', value: 1, icon: '⏳' },
  { title: 'Approved', value: 1, icon: '✅' },
  { title: 'Categories Applied', value: 2, icon: '📁' },
];

const recentApplications = [
  {
    id: 'APP-001',
    category: 'Construction Materials',
    status: 'pending' as const,
    submittedDate: '2026-03-05',
    lastUpdated: '2026-03-08',
  },
  {
    id: 'APP-002',
    category: 'Office Supplies',
    status: 'approved' as const,
    submittedDate: '2026-02-20',
    lastUpdated: '2026-02-28',
  },
];

const steps = [
  { number: 1, title: 'Select Category', description: 'Choose a supply category to apply for', link: '/dashboard/categories' },
  { number: 2, title: 'Download Form', description: 'Get the application form for your category', link: '/dashboard/apply' },
  { number: 3, title: 'Upload Documents', description: 'Submit required documents', link: '/dashboard/documents' },
  { number: 4, title: 'Make Payment', description: 'Pay application fee and upload proof', link: '/dashboard/payment' },
];

export default function DashboardHome() {
  const handleViewApplication = (id: string) => {
    console.log('View application:', id);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>
        <p className="text-gray-600">Here's an overview of your supplier portal activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Application Process Steps */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <Link
              key={step.number}
              to={step.link}
              className="relative p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-blue-600">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-300">
                  →
                </div>
              )}
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Applications */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Applications</h2>
          <Link 
            to="/dashboard/applications" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        
        {recentApplications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                {...app}
                onView={handleViewApplication}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-4">Start by selecting a category to apply for</p>
            <Link
              to="/dashboard/categories"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Categories
            </Link>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/dashboard/categories"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <span>📁</span>
            <span>Apply for Category</span>
          </Link>
          <Link
            to="/dashboard/documents"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <span>📄</span>
            <span>Upload Documents</span>
          </Link>
          <Link
            to="/dashboard/payment"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <span>💳</span>
            <span>Make Payment</span>
          </Link>
        </div>
      </Card>
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  fee: string;
  requirements: string[];
  onApply: (id: string) => void;
}

export function CategoryCard({ id, name, description, fee, requirements, onApply }: CategoryCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
        <ul className="text-sm text-gray-600 space-y-1">
          {requirements.slice(0, 3).map((req, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              {req}
            </li>
          ))}
          {requirements.length > 3 && (
            <li className="text-gray-400">+{requirements.length - 3} more</li>
          )}
        </ul>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Application Fee</p>
          <p className="text-lg font-bold text-blue-600">{fee}</p>
        </div>
        <button
          onClick={() => onApply(id)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Now
        </button>
      </div>
    </Card>
  );
}

interface ApplicationCardProps {
  id: string;
  category: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'payment_pending';
  submittedDate?: string;
  lastUpdated: string;
  onView: (id: string) => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  payment_pending: 'bg-orange-100 text-orange-700',
};

const statusLabels = {
  draft: 'Draft',
  pending: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  payment_pending: 'Payment Pending',
};

export function ApplicationCard({ id, category, status, submittedDate, lastUpdated, onView }: ApplicationCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">{category}</h3>
          <p className="text-sm text-gray-500">Application #{id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        {submittedDate && (
          <p>Submitted: {submittedDate}</p>
        )}
        <p>Last Updated: {lastUpdated}</p>
      </div>
      
      <button
        onClick={() => onView(id)}
        className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
      >
        View Details
      </button>
    </Card>
  );
}

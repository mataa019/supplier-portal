import { Link } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  CreditCardIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Logo from '../assets/Minet_Logo.png';

const features = [
  {
    icon: ClipboardDocumentListIcon,
    title: 'Browse Categories',
    description: 'Explore available supplier categories and find the right fit for your business.',
  },
  {
    icon: DocumentCheckIcon,
    title: 'Submit Documents',
    description: 'Upload required documents securely through our online portal.',
  },
  {
    icon: CreditCardIcon,
    title: 'Easy Payments',
    description: 'Pay application fees conveniently with multiple payment options.',
  },
  {
    icon: CheckBadgeIcon,
    title: 'Track Applications',
    description: 'Monitor your application status in real-time from submission to approval.',
  },
];

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Minet Zambia" className="h-10" />
            <span className="text-lg font-semibold text-gray-900">Supplier Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-700 to-red-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Minet Zambia Supplier Portal
            </h1>
            <p className="text-lg text-red-100 mb-8">
              Register as a supplier and access opportunities to provide goods and services 
              to Minet Zambia. Our streamlined online process makes it easy to apply, 
              submit documents, and track your application status.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Started
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600">Simple steps to become a registered supplier</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration Process</h2>
            <p className="text-gray-600">Complete these steps to register as a supplier</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                { step: 1, title: 'Create an Account', desc: 'Register with your company details including TPIN and registration number.' },
                { step: 2, title: 'Select Category', desc: 'Choose the supplier category that matches your business offerings.' },
                { step: 3, title: 'Upload Documents', desc: 'Submit required documents such as business registration, tax certificates, and more.' },
                { step: 4, title: 'Pay Application Fee', desc: 'Complete payment through bank transfer or mobile money.' },
                { step: 5, title: 'Await Approval', desc: 'Your application will be reviewed and you\'ll be notified of the outcome.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                    {item.step}
                  </div>
                  <div className="pt-1">
                    <h4 className="text-base font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join our network of trusted suppliers and access business opportunities with Minet Zambia.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Register Now
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Minet Zambia" className="h-8" />
              <span className="text-sm text-gray-600">© 2026 Minet Zambia. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms of Service</a>
              <a href="#" className="hover:text-gray-900">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

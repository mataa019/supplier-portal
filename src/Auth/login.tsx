import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../component/TextInput';
import Logo from '../assets/Minet_Logo.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'supplier' | 'admin'>('supplier');

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Role-based redirect
    if (userType === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <img src={Logo} alt="Minet Zambia" className="h-12 sm:h-14 mb-3" />
          <span className="text-lg font-semibold text-gray-900">Login </span>
        </div>

        {/* Title */}
        <h2 className="text-base font-medium text-gray-600 text-center mb-6">
          Sign in to your account
        </h2>

        {/* User Type Selector */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setUserType('supplier')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
              userType === 'supplier'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Supplier
          </button>
          <button
            type="button"
            onClick={() => setUserType('admin')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
              userType === 'admin'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />

          <TextInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <button
            type="submit"
            className={`w-full py-3 text-sm font-medium text-white rounded-lg transition-colors ${
              userType === 'admin'
                ? 'bg-gray-900 hover:bg-gray-800'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Sign In as {userType === 'admin' ? 'Admin' : 'Supplier'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-600 hover:text-red-700 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}


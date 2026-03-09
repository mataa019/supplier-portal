import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../component/TextInput';
import Logo from '../assets/Minet_Logo.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // bypass validation, redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={Logo} alt="Minet Zambia" className="h-14 mb-3" />
          <span className="text-lg font-semibold text-gray-900">Supplier Portal</span>
        </div>

        {/* Title */}
        <h2 className="text-base font-medium text-gray-600 text-center mb-6">
          Sign in to your account
        </h2>

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
            className="w-full py-3 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign In
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


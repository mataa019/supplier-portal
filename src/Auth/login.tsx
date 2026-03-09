import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../component/TextInput';
import Button from '../component/Button';

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
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-semibold text-gray-800">Supplier Portal</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">
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

          <Button type="submit" variant="primary" fullWidth>
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}


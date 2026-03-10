import { useState } from 'react';
import { Link } from 'react-router-dom';
import TextInput from '../component/TextInput';
import Logo from '../assets/Minet_Logo.png';

export default function Register() {
  const [formData, setFormData] = useState({
    companyName: '',
    registeredNumber: '',
    tpin: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    // Handle registration logic here
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 sm:py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <img src={Logo} alt="Minet Zambia" className="h-12 sm:h-14 mb-3" />
          <br></br>
          <span className="text-lg font-semibold text-gray-900">Get Started</span>
        </div>

        {/* Title */}
        <h2 className="text-base font-medium text-gray-600 text-center mb-6">
          Register your company for supplier portal access
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            id="companyName"
            label="Company Name"
            value={formData.companyName}
            onChange={handleChange('companyName')}
            placeholder="Enter company name"
            required
          />

          <TextInput
            id="registeredNumber"
            label="Company Registered Number"
            value={formData.registeredNumber}
            onChange={handleChange('registeredNumber')}
            placeholder="Enter registered number"
            required
          />

          <TextInput
            id="tpin"
            label="TPIN"
            value={formData.tpin}
            onChange={handleChange('tpin')}
            placeholder="Enter TPIN"
            required
          />

          <TextInput
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange('phoneNumber')}
            placeholder="Enter phone number"
            required
          />

          <TextInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="Enter email address"
            required
          />

          <TextInput
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            placeholder="Enter password"
            required
          />

          <TextInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder="Confirm your password"
            required
          />

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Register
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

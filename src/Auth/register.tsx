import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../component/TextInput';
import Logo from '../assets/Minet_Logo.png';
import { registerSupplier } from '../apiservice/Apiservice';

export default function Register() {
  const [step, setStep] = useState(1);
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };


  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsLoading(true);
    
    try {
      await registerSupplier({
        companyName: formData.companyName,
        registrationNumber: formData.registeredNumber,
        tpin: formData.tpin,
        phone: formData.phoneNumber,
        email: formData.email,
        password: formData.password
      })
      navigate('/login')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 sm:py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <img src={Logo} alt="Minet Zambia" className="h-12 sm:h-14 mb-3" />
          <span className="text-lg font-semibold text-gray-900">Registration</span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base font-medium text-gray-600 text-center mb-6">
          {step === 1 ? 'Enter your company details' : 'Create your password'}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Company Details */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
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

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{formData.companyName}</span>
                <br />
                <span className="text-xs">{formData.email}</span>
              </p>
            </div>

            <TextInput
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Enter password (min. 8 characters)"
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

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="w-full py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </form>
        )}

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

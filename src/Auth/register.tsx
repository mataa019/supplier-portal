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
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={Logo} alt="Minet Zambia" className="h-14 mb-3" />
          <span className="text-lg font-semibold text-gray-900">Supplier Portal</span>
        </div>

        {/* Title */}
        <h2 className="text-base font-medium text-gray-600 text-center mb-6">
          Register your company for supplier portal access
        </h2>

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

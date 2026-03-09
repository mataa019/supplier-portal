import { useState } from 'react';
import TextInput from '../component/TextInput';
import Button from '../component/Button';

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
          Register your company
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
            <Button type="submit" variant="primary" fullWidth>
              Register
            </Button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TextInput from '../component/TextInput';
import Logo from '../assets/Minet_Logo.png';
import { verifyOtp } from '../apiservice/Apiservice';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from router state if available
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!otp) {
        throw new Error('Please enter the OTP');
      }

      // We send otp and optionally email if your API needs it
      // The user spec said just payload { "otp": "..." } 
      // but usually context is needed. 
      // I'll send just otp if email is not needed, or both.
      // For now, let's include email if present or just otp.
      
      const payload: any = { otp };
      if (email) payload.email = email;

      const data = await verifyOtp(payload);
      
      // If verification successful, store fully authenticated token if returned
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
         localStorage.setItem('user', JSON.stringify(data.user));
         if (data.user.role === 'admin') {
             navigate('/admin');
         } else {
             navigate('/dashboard');
         }
      } else {
         // Default fallback
         navigate('/dashboard');
      }

    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="flex flex-col items-center mb-6 sm:mb-8">
                <img src={Logo} alt="Minet Zambia" className="h-10 sm:h-14 mb-3" />
                <h2 className="text-xl font-semibold text-gray-900">Verify Email</h2>
                <p className="text-sm text-gray-500 mt-2 text-center">
                    Enter the OTP sent to your email {email && <span className="font-medium text-gray-900">{email}</span>}
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <TextInput
                    id="otp"
                    label="One-Time Password"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 5-digit OTP"
                    required
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
            </form>
        </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TextInput from '../component/TextInput';
import LoadingOverlay from '../component/LoadingOverlay';
import Logo from '../assets/Minet_Logo.png';
import { verifyOtp, resendOtp } from '../apiservice/Apiservice';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from router state or session storage
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      const pendingEmail = sessionStorage.getItem('pendingLoginEmail');
      if (pendingEmail) setEmail(pendingEmail);
    }
  }, [location]);

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setResendStatus(null);
    setError('');

    try {
      // Minimum 1.5s delay for better UX
      await Promise.all([
        resendOtp({ email }),
        new Promise(resolve => setTimeout(resolve, 1700))
      ]);
      setResendStatus('OTP has been resent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!otp) throw new Error('Please enter the OTP');

      // Minimum 1.5s delay for better UX
      const [res] = await Promise.all([
        verifyOtp({ otp }), // only otp (5 digits)
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);

      if (res.accessToken) localStorage.setItem('token', res.accessToken);
      if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
      
      sessionStorage.removeItem('pendingLoginEmail');

      if (res.user?.role === 'admin' || res.user?.role === 'manager') {
        navigate('/admin');
      } else {
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
        {isLoading && <LoadingOverlay message="Verifying..." />}
        {isResending && <LoadingOverlay message="Resending OTP..." />}
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="flex flex-col items-center mb-6 sm:mb-8">
                <img src={Logo} alt="Minet Zambia" className="h-10 sm:h-14 mb-3" />
                <h2 className="text-xl font-semibold text-gray-900">Verify Otp</h2>
                <p className="text-sm text-gray-500 mt-2 text-center">
                    Enter the OTP sent to your email {email && <span className="font-medium text-gray-900">{email}</span>}
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                    {error}
                </div>
            )}

            {resendStatus && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
                    {resendStatus}
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

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    Didn't receive the code?{' '}
                    <button 
                        onClick={handleResend}
                        disabled={isResending || !email}
                        className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResending ? 'Resending...' : 'Resend OTP'}
                    </button>
                </p>
                <div className="mt-4">
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Back to Login
                  </button>
                </div>
            </div>
        </div>
    </div>
  );
}

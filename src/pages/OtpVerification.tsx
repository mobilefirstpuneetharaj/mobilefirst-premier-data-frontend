import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

import { preventSpace } from '../utils/inputHandlers';

const OtpSchema = Yup.object().shape({
  otp: Yup.string().matches(/^\d{6}$/, 'Enter a valid 6-digit code').required('Required'),
});

export default function OtpVerification() {
  const { 
    verifyResetOtp, 
    resendOtp,
    isLoading, 
    error, 
    clearError 
  } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [purpose, setPurpose] = useState<'registration' | 'password-reset'>('registration');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    clearError();
    
    // Check if this is for password reset or registration
    if (location.state?.email) {
      setPurpose('password-reset');
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect to appropriate page
      navigate('/forgot-password');
    }
  }, [location, navigate, clearError]);

  const handleSubmit = async (values: { otp: string }) => {
    if (purpose === 'password-reset') {
      const result=await verifyResetOtp(email, values.otp);
      if(result && result.success){
        navigate('/reset-password', { state: { email } });
      }
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      await resendOtp(email);
      // OTP will be automatically resent via the store action
    } catch (err) {
      console.error('Failed to resend OTP:', err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-[#0b2447] py-4 px-8">
        <img src={logo} alt="Logo" className="h-8" />
      </header>
      <main className="flex-grow flex justify-center items-center px-4">
        <div className="max-w-md w-full  rounded-lg shadow-lg p-8">
          <img src={logo} alt="Logo" className="h-10 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-[#0b2447] mb-2">
            Forgot your password
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter the code sent to {email} to Reset Password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <Formik
            initialValues={{ otp: '' }}
            validationSchema={OtpSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OTP</label>
                <Field
                  name="otp"
                  placeholder="Enter 6 Digit Code Here"
                  className="w-full p-3 border rounded text-center text-lg"
                  maxLength={6}
                  onKeyDown={preventSpace}
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                className={`text-sm text-blue-600 cursor-pointer text-center w-full ${
                  resendLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {resendLoading ? 'Sending...' : 'Resend Code ?'}
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-[#0b2447] text-white rounded ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </Form>
          </Formik>
        </div>
      </main>
    </div>
  );
}
import { Formik, Form} from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store';
import { useNavigate,useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';
import logo from '../assets/logo.png';

import PasswordInput from '../components/PasswordInput'

const ResetSchema = Yup.object().shape({
  password: Yup.string()
      .length(8, 'Minimum 8 characters')
      .matches(/^\S*$/, 'No spaces allowed') // disallow spaces
      .matches(/[A-Z]/, 'At least 1 uppercase letter')
      .matches(/[a-z]/, 'At least 1 lowercase letter')
      .matches(/\d/, 'At least 1 number')
      .matches(/[^A-Za-z0-9]/, 'At least 1 special character')
      .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

export default function ResetPassword() {
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    clearError();
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate, clearError]);

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    await resetPassword(email, values.password);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-[#0b2447] py-4 px-8">
        <img src={logo} alt="Logo" className="h-8" />
      </header>
      <main className="flex-grow flex justify-center items-center px-4">
        <div className="max-w-md w-full rounded-lg shadow-lg p-8">
          <img src={logo} alt="Logo" className="h-10 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-[#0b2447] mb-6">Reset Password</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={ResetSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4">
              <PasswordInput name='password' placeholder='password' maxLength={8} />

              <div className="text-sm text-gray-500 mb-4">
                Password requirements:
                <ul className="list-disc ml-5 mt-2">
                  <li>Minimum 8 characters</li>
                  <li>At least 1 uppercase letter</li>
                  <li>At least 1 lowercase letter</li>
                  <li>At least 1 number</li>
                  <li>At least 1 special character</li>
                </ul>
              </div>

              <PasswordInput name="confirmPassword" placeholder="Confirm Password" />

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-[#0b2447] text-white rounded ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </Form>
          </Formik>
        </div>
      </main>
    </div>
  );
}
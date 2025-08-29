import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import ToastContainer from '../components/ToastContainer';

import { preventSpace } from '../utils/inputHandlers';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

export default function ForgotPassword() {
  const { forgotPassword, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string }) => {
    await forgotPassword(values.email);
    // Redirect to OTP verification page with the email
    navigate('/otp-verification', { 
      state: { 
        email: values.email,
        purpose: 'password-reset' 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-[#0b2447] py-4 px-8">
        <img src={logo} alt="Logo" className="h-8" />
      </header>
      <main className="flex-grow flex justify-center items-center px-4">
        <div className="w-full max-w-md  rounded-lg shadow-lg p-[50px]">
          <img src={logo} alt="Logo" className="h-10 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-[#0b2447] mb-6">Forgot Password</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-3">
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Your email"
                  className="w-full p-3 border rounded"
                   onKeyDown={preventSpace}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-[#0b2447] text-white rounded ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </Form>
          </Formik>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
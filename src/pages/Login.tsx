import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import ToastContainer from '../components/ToastContainer';
import logo from '../assets/logo.png';

import { preventSpace } from '../utils/inputHandlers';

import PasswordInput from '../components/PasswordInput'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .length(8, 'Minimum 8 characters')
      .matches(/^\S*$/, 'No spaces allowed') // disallow spaces
      .required('Required'),
});


export default function Login() {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-[#0b2447] py-4 px-8">
        <img src={logo} alt="Logo" className="h-8" />
      </header>
      <main className="flex-grow flex justify-center items-center px-4">
        <div className="w-full max-w-md  rounded-lg shadow-lg p-[50px]">
          <img src={logo} alt="Logo" className="h-10 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-[#0b2447] mb-6">Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values) => {
              await login(values.email, values.password);
            }}
          >
            <Form className="space-y-4">
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded"
                  onKeyDown={preventSpace}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <PasswordInput name='password' placeholder='password' maxLength={8} />

              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-[#0b2447] text-white rounded ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              <div className="text-center mt-4">
                <span className="text-gray-600">Don't have an account? </span>
                <Link 
                  to="/sign-up" 
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </Form>
          </Formik>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
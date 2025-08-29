import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import ToastContainer from '../components/ToastContainer';
import logo from '../assets/logo.png';

import { preventSpace } from '../utils/inputHandlers';

import PasswordInput from '../components/PasswordInput'

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Required'),
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

export default function Signup() {
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/sign-up');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-[#0b2447] py-4 px-8">
        <img src={logo} alt="Logo" className="h-8" />
      </header>
      <main className="flex-grow flex justify-center items-center px-4">
        <div className="w-full max-w-md rounded-lg shadow-lg p-[50px]">
          <img src={logo} alt="Logo" className="h-10 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-[#0b2447] mb-6">Sign Up</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              const result=await register({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
              });

              // If registration was successful, redirect to login
              if (result.success) {
                setTimeout(() => {
                  navigate('/login');
                }, 1000); // Redirect after 1 seconds to show success message
              }
            }}
          >
            <Form className="space-y-3">
              <div>
                <Field
                  name="firstName"
                  placeholder="First Name"
                  className="w-full p-3 border rounded"
                   onKeyDown={preventSpace}
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <Field
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full p-3 border rounded"
                  onKeyDown={preventSpace}
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

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
                  className="text-red-500 text-sm"
                />
              </div>

              <PasswordInput name='password' placeholder='password' maxLength={8} />

              <PasswordInput name="confirmPassword" placeholder="Confirm Password" />

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-[#0b2447] text-white rounded ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>

              <div className="text-center mt-4">
                <span className="text-gray-600">Already have an account? </span>
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login
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
import { useState } from 'react';
import type { FormEvent } from 'react';

import logo from '../assets/logo.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Enter a valid email');
    } else {
      setError('');
      console.log('Sending OTP to:', email);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-[#0b2447] py-4 px-8">
        <img src={logo} alt="Premier Data" className="h-8" />
      </header>
      <main className="flex-grow flex justify-center items-center px-4">
        <div className="max-w-md w-full border rounded-lg shadow-lg p-8">
          <img src={logo} alt="Premier Data" className="h-10 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-[#0b2447] mb-2">Forgot your password</h2>
          <p className="text-sm text-gray-500 mb-4">Please enter your registered email address</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="email" className="w-full p-3 border rounded" placeholder="Enter your email ID" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="w-full py-3 bg-[#0b2447] text-white rounded">Send OTP</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;

import { useState } from 'react';
import type { FormEvent } from 'react';

import logo from '../assets/logo.png';

function OtpVerification() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
    } else {
      setError('');
      console.log('OTP Verified:', otp);
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
          <p className="text-sm text-gray-500 mb-4">Enter the code sent to xyz@example.com to Reset Password.</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter 6 Digit Code here" className="w-full p-3 border rounded" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <p className="text-sm text-blue-600 cursor-pointer">Resend Code ?</p>
            <button type="submit" className="w-full py-3 bg-[#0b2447] text-white rounded">Verify OTP</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default OtpVerification;

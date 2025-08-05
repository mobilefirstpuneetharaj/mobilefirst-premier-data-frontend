import { useState } from 'react';
import type { FormEvent } from 'react';

import logo from '../assets/logo.png';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const isValidPassword = (pwd: string) =>
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /\d/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidPassword(password)) {
      setError('Password must meet all requirements');
    } else if (password !== confirmPassword) {
      setError("Passwords don't match");
    } else {
      setError('');
      console.log('Password reset:', password);
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
          <h2 className="text-xl font-semibold text-[#0b2447] mb-6">Reset password</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="password" placeholder="Enter New Password" className="w-full p-3 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="text-sm text-gray-500 mb-4">
              The password must be 8+ characters and include:
              <ul className="list-disc ml-5 mt-2">
                <li>1 upper case</li>
                <li>1 special character</li>
                <li>1 lower case</li>
                <li>1 number</li>
              </ul>
            </div>
            <input type="password" placeholder="Enter Confirm Password" className="w-full p-3 border rounded" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <button type="submit" className="w-full py-3 bg-[#0b2447] text-white rounded">Submit</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;
    
import { useState } from 'react';
import type { FormEvent } from 'react';

import logo from '../assets/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || password.length < 6) {
      setError('Please enter valid credentials');
    } else {
      setError('');
      console.log('Login successful', { email, password });
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
          <h2 className="text-xl font-semibold text-[#0b2447] mb-6">Login</h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="email" placeholder="Enter your email ID" className="w-full p-3 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Enter your password" className="w-full p-3 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="text-sm text-right text-blue-600 cursor-pointer">Forgot Password ?</p>
            <button type="submit" className="w-full py-3 bg-[#0b2447] text-white rounded">Submit</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;

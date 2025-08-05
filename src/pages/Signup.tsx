import { useState } from 'react';
import type { FormEvent } from 'react';

import logo from '../assets/logo.png';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!formData.firstName || !formData.lastName) newErrors.push('Name is required');
    if (!formData.email.includes('@')) newErrors.push('Valid email is required');
    if (formData.password.length < 6) newErrors.push('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) newErrors.push("Passwords don't match");

    setErrors(newErrors);
    if (newErrors.length === 0) {
      // Handle signup
      console.log('Signup data:', formData);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-[#0b2447] py-4 px-8">
        <img src={logo} alt="Premier Data" className="h-8" />
      </header>
      <main className="flex-grow flex justify-center items-center mb-3 px-4 ">
        <div className="w-full max-w-md gap-y-[25px] border-1 border-[#F4F4F4]  rounded-[8px] shadow-lg p-[50px]">
          <img src={logo} alt="Premier Data" className="h-10 mx-auto mb-6" />
          <div className="gap-y-[10px] mb-4">
            <h2 className="text-xl font-style-barlow font-semibold text-[#0b2447] mb-6">Sign-up</h2>
            {errors.length > 0 && (
              <ul className="text-red-500 text-sm mb-2">
                {errors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            )}
            <form className="space-y-3 flex flex-col" onSubmit={handleSubmit}>
              <input type="text" name="firstName" placeholder="Enter your First Name" className="w-full p-3 mb-3 border rounded" value={formData.firstName} onChange={handleChange} />
              <input type="text" name="lastName" placeholder="Enter your Last Name" className="w-full p-3 mb-3 border rounded" value={formData.lastName} onChange={handleChange} />
              <input type="email" name="email" placeholder="Enter your Email" className="w-full p-3 border mb-3 rounded" value={formData.email} onChange={handleChange} />
              <input type="password" name="password" placeholder="Enter your password" className="w-full p-3 mb-3 border rounded" value={formData.password} onChange={handleChange} />
              <input type="password" name="confirmPassword" placeholder="Enter your Confirm password" className="w-full p-3 mb-3 border rounded" value={formData.confirmPassword} onChange={handleChange} />
              <button type="submit" className="w-full py-3 mb-3 bg-[#0b2447] text-[white] rounded">Sign-up</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;

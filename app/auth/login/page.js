'use client';
import { useState } from 'react';
import api from '../../lib/axios'; // Adjust the import path
import Link from 'next/link';
import Cookies from 'js-cookie'; // Import js-cookie

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/login', formData);
      console.log('Login response:', response.data);

      if (response.status === 200 && response.data.token) {
        // Login successful
        // Save the JWT token as a cookie
        Cookies.set('token', response.data.token, { expires: 1 }); // Expires in 1 day
        Cookies.set('user_email', response.data.user.email, { expires: 1 }); // Expires in 1 day
        Cookies.set('user_name', response.data.user.name, { expires: 1 }); // Expires in 1 day

        // Redirect to dashboard or another page
        window.location.href = '/dashboard';
      } else {
        // Handle specific error messages from the backend
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <main className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Login</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <Link href="/">
            <span className="text-blue-500 hover:underline cursor-pointer text-sm">
              Back to Home
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}

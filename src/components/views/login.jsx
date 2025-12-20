import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, Truck } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/login',
        { username, password }
      );

      console.log('LOGIN RESPONSE:', response.data);

      // 🔥 THIS WAS MISSING (ROOT CAUSE)
      const token = response.data.token;

      if (!token) {
        throw new Error('Token not received from server');
      }

      // ✅ STORE TOKEN FOR ALL API CALLS
 //   localStorage.setItem('token', token);

      navigate('/ManageCompany');
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-200">

        <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <Truck className="text-blue-700 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white">HighwayIQ</h1>
            <p className="text-blue-100 text-sm">Truck Driver Management System</p>
          </div>
        </div>

        <div className="px-8 py-10">
          <h2 className="text-2xl font-semibold text-center text-blue-900 mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-800">
                Username
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-blue-300 bg-blue-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 py-3 w-full rounded-lg border border-blue-300 bg-blue-50"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              Sign In
            </button>
          </form>
        </div>

        <div className="bg-blue-50 py-4 text-center text-xs text-blue-600">
          © {new Date().getFullYear()} HighwayIQ
        </div>
      </div>
    </div>
  );
};

export default Login;

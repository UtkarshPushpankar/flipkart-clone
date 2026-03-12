import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../store/api/authApi';
import { useAppDispatch } from '../hooks/redux';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await login(form).unwrap();
      dispatch(setCredentials(data));
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="flex bg-white rounded-sm shadow-2xl overflow-hidden w-full max-w-4xl">
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-12 hidden md:flex flex-col justify-between w-2/5 text-white">
          <div>
            <h1 className="text-4xl font-bold italic mb-2">Flipkart</h1>
            <p className="text-blue-100 text-lg">Your Daily Shopping Destination</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold">Secure & Safe</p>
                <p className="text-sm text-blue-100">Bank-grade encryption for your data</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold">Easy Returns</p>
                <p className="text-sm text-blue-100">10-day easy returns policy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold">Fast Delivery</p>
                <p className="text-sm text-blue-100">Get your orders within 3-5 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
            <p className="text-gray-600">Access your account to manage orders and wishlist</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mb-6">
            <div>
              <label className="text-sm text-gray-700 font-semibold block mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border-b-2 border-gray-300 pb-2 outline-none text-sm focus:border-blue-600 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-semibold block mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full border-b-2 border-gray-300 pb-2 outline-none text-sm focus:border-blue-600 transition-colors"
              />
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              By logging in, you agree to Flipkart's Terms of Use and Privacy Policy.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-sm text-base transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3 mb-6 text-sm text-gray-700">
            <p className="font-semibold text-blue-900 mb-1">Demo Credentials:</p>
            <p className="text-xs text-gray-600">Email: <code className="bg-white px-1 py-0.5 rounded">user@flipkart.com</code></p>
            <p className="text-xs text-gray-600">Password: <code className="bg-white px-1 py-0.5 rounded">password123</code></p>
          </div>

          {/* Sign Up Link */}
          <div className="text-center border-t pt-6">
            <span className="text-sm text-gray-600">New to Flipkart? </span>
            <Link to="/signup" className="text-orange-500 font-bold text-sm hover:text-orange-600 transition">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

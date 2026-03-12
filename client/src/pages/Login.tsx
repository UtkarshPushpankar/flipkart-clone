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
    <div className="min-h-screen bg-flipblue flex items-center justify-center p-4">
      <div className="flex bg-white rounded-sm shadow-2xl overflow-hidden w-full max-w-3xl min-h-96">
        <div className="bg-flipblue p-10 hidden md:flex flex-col justify-between w-2/5">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight">Login</h2>
            <p className="text-blue-200 mt-3 text-sm leading-relaxed">Get access to your Orders, Wishlist and Recommendations</p>
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Enter Email"
                value={form.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border-b border-gray-300 pb-2 outline-none text-sm focus:border-flipblue transition-colors"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full border-b border-gray-300 pb-2 outline-none text-sm focus:border-flipblue transition-colors"
              />
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.</p>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-fliporange text-white font-bold py-3 rounded text-sm hover:bg-orange-600 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">New to Flipkart? </span>
            <Link to="/signup" className="text-flipblue font-semibold text-sm">Create an account</Link>
          </div>
          <div className="text-center mt-2 text-xs text-gray-400">
            Demo: user@flipkart.com / password123
          </div>
        </div>
      </div>
    </div>
  );
}

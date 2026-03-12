import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../store/api/authApi';
import { useAppDispatch } from '../hooks/redux';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface FormField {
  name: keyof SignupForm;
  placeholder: string;
  type: string;
  required: boolean;
}

const FORM_FIELDS: FormField[] = [
  { name: 'name', placeholder: 'Full Name', type: 'text', required: true },
  { name: 'email', placeholder: 'Email', type: 'email', required: true },
  { name: 'phone', placeholder: 'Mobile Number (optional)', type: 'tel', required: false },
  { name: 'password', placeholder: 'Password (min 6 characters)', type: 'password', required: true },
];

export default function Signup() {
  const [form, setForm] = useState<SignupForm>({ name: '', email: '', password: '', phone: '' });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await register(form).unwrap();
      dispatch(setCredentials(data));
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-flipblue flex items-center justify-center p-4">
      <div className="flex bg-white rounded-sm shadow-2xl overflow-hidden w-full max-w-3xl">
        <div className="bg-flipblue p-10 hidden md:flex flex-col justify-center w-2/5">
          <h2 className="text-3xl font-bold text-white">Looks like you're new here!</h2>
          <p className="text-blue-200 mt-3 text-sm">Sign up with your details to get started</p>
        </div>
        <div className="flex-1 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {FORM_FIELDS.map((field) => (
              <input
                key={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, [field.name]: e.target.value })
                }
                required={field.required}
                className="w-full border-b border-gray-300 pb-2 outline-none text-sm focus:border-flipblue transition-colors block"
              />
            ))}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-fliporange text-white font-bold py-3 rounded text-sm hover:bg-orange-600 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-flipblue font-semibold text-sm">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

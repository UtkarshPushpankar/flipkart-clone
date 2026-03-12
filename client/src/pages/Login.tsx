import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { useLoginMutation } from "../store/api/authApi";
import { useAppDispatch } from "../hooks/redux";
import { setCredentials } from "../store/slices/authSlice";
import toast from "react-hot-toast";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = await login(form).unwrap();
      dispatch(setCredentials(data));
      toast.success(`Welcome back, ${data.user.name}`);
      navigate("/");
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Login failed");
    }
  };

  return (
    <div className="fk-page py-8">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-sm bg-white shadow lg:grid-cols-[360px_1fr]">
        <div className="bg-[#2874f0] p-8 text-white">
          <h1 className="text-3xl font-semibold">Login</h1>
          <p className="mt-3 text-sm text-blue-100">Get access to your Orders, Wishlist and Recommendations.</p>

          <div className="mt-8 space-y-3 text-sm text-blue-100">
            <p className="flex items-center gap-2">
              <FiCheckCircle /> Faster checkout
            </p>
            <p className="flex items-center gap-2">
              <FiCheckCircle /> Secure transactions
            </p>
            <p className="flex items-center gap-2">
              <FiCheckCircle /> Real-time order updates
            </p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full border-b border-[#d9d9d9] py-2 text-sm outline-none focus:border-[#2874f0]"
              required
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full border-b border-[#d9d9d9] py-2 text-sm outline-none focus:border-[#2874f0]"
              required
            />

            <p className="text-xs text-[#878787]">
              By continuing, you agree to Flipkart clone Terms of Use and Privacy Policy.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-sm bg-[#fb641b] py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 rounded-sm bg-[#f5f8ff] p-3 text-xs text-[#212121]">
            Demo login: <strong>user@flipkart.com</strong> / <strong>password123</strong>
          </div>

          <div className="mt-6 text-center text-sm">
            New to Flipkart?{" "}
            <Link to="/signup" className="font-semibold text-[#2874f0]">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

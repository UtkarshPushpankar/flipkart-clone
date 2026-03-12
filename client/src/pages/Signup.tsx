import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../store/api/authApi";
import { useAppDispatch } from "../hooks/redux";
import { setCredentials } from "../store/slices/authSlice";
import toast from "react-hot-toast";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export default function Signup() {
  const [form, setForm] = useState<SignupForm>({ name: "", email: "", password: "", phone: "" });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = await register(form).unwrap();
      dispatch(setCredentials(data));
      toast.success("Account created");
      navigate("/");
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Registration failed");
    }
  };

  return (
    <div className="fk-page py-8">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-sm bg-white shadow lg:grid-cols-[360px_1fr]">
        <div className="bg-[#2874f0] p-8 text-white">
          <h1 className="text-3xl font-semibold">Sign up</h1>
          <p className="mt-3 text-sm text-blue-100">
            Looks like you are new here. Enter your details to create an account.
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full border-b border-[#d9d9d9] py-2 text-sm outline-none focus:border-[#2874f0]"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full border-b border-[#d9d9d9] py-2 text-sm outline-none focus:border-[#2874f0]"
              required
            />
            <input
              type="tel"
              placeholder="Mobile Number (optional)"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="w-full border-b border-[#d9d9d9] py-2 text-sm outline-none focus:border-[#2874f0]"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full border-b border-[#d9d9d9] py-2 text-sm outline-none focus:border-[#2874f0]"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-sm bg-[#fb641b] py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            Existing user?{" "}
            <Link to="/login" className="font-semibold text-[#2874f0]">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

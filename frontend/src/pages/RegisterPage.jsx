import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const getValidationErrors = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required.";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export default function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const redirectPath = location.state?.from || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = getValidationErrors(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitError("");
      setSuccessMessage("");
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccessMessage("Account created successfully. Redirecting to your dashboard...");
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_35px_120px_rgba(15,23,42,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="p-8 sm:p-10">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
              Create account
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Sign up</h2>
            <p className="mt-3 text-sm text-slate-600">
              Start with a secure JWT-based account connected to your backend.
            </p>

            <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              For presentations, you can also use the seeded demo account instead of creating a new one.
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                  placeholder="Adwaith J S"
                />
                {errors.name ? <p className="mt-2 text-sm text-rose-600">{errors.name}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                  placeholder="you@example.com"
                />
                {errors.email ? (
                  <p className="mt-2 text-sm text-rose-600">{errors.email}</p>
                ) : null}
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-slate-800"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                  placeholder="At least 6 characters"
                />
                {errors.password ? (
                  <p className="mt-2 text-sm text-rose-600">{errors.password}</p>
                ) : null}
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-slate-800"
                  htmlFor="confirmPassword"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                  placeholder="Re-enter your password"
                />
                {errors.confirmPassword ? (
                  <p className="mt-2 text-sm text-rose-600">{errors.confirmPassword}</p>
                ) : null}
              </div>

              {submitError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {submitError}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-sky-700 hover:text-sky-600">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <section className="hidden bg-[linear-gradient(160deg,_#0f172a,_#1d4ed8_58%,_#38bdf8)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-200">
              Secure onboarding
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Create your account and enter the protected dashboard immediately.
            </h1>
          </div>
          <div className="space-y-4 text-sm text-sky-100">
            <p>Passwords are hashed with bcryptjs before being stored in MongoDB.</p>
            <p>Tokens are restored on refresh and attached to API requests automatically.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

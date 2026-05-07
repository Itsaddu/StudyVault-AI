import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const getValidationErrors = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
};

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login, sessionMessage, clearSessionMessage } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    if (sessionMessage) {
      clearSessionMessage();
    }
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
      await login(formData);
      setSuccessMessage("Login successful. Redirecting to your dashboard...");
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_35px_120px_rgba(15,23,42,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300">
              StudyVault AI
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Sign in to continue building your study system.
            </h1>
          </div>
          <div className="space-y-4 text-sm text-slate-300">
            <p>JWT session persistence is already wired to the backend profile endpoint.</p>
            <p>Protected routes automatically redirect unauthenticated users.</p>
          </div>
        </section>

        <section className="p-8 sm:p-10">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
              Welcome back
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Login</h2>
            <p className="mt-3 text-sm text-slate-600">
              Use your StudyVault AI credentials to access the dashboard.
            </p>

            <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              Demo mode: after seeding, sign in with the demo account from the README.
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              {sessionMessage ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {sessionMessage}
                </div>
              ) : null}

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
                  placeholder="Enter your password"
                />
                {errors.password ? (
                  <p className="mt-2 text-sm text-rose-600">{errors.password}</p>
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
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              Need an account?{" "}
              <Link to="/register" className="font-semibold text-sky-700 hover:text-sky-600">
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="glass-panel w-full max-w-xl rounded-[2rem] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
          404 state
        </p>
        <h1 className="mt-4 text-3xl font-bold text-white">Page not found</h1>
        <p className="mt-3 text-slate-300">
          The page you tried to open does not exist or is not available in this demo build.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}

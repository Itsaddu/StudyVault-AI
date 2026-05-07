import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="glass-panel mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-between rounded-[2.2rem] p-8 xl:p-12">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              StudyVault AI
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">
              AI-first study workspace for notes, quizzes, summaries, and flashcards
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Open dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
              Portfolio-ready, deployment-ready, presentation-ready
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              StudyVault AI combines secure authentication, note uploads, structured AI study
              generation, and a polished dashboard experience built for demos and portfolio
              walkthroughs.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                "Upload and search notes",
                "Generate AI study material",
                "Demo with seeded content",
              ].map((item) => (
                <div key={item} className="surface-card p-5">
                  <p className="text-sm font-semibold text-white">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-amber-300/20 bg-amber-400/10 p-5">
              <p className="text-sm font-semibold text-amber-100">Demo account support</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Run the demo seed script to create a ready-made account, sample notes, summaries,
                quizzes, and flashcards for presentations.
              </p>
            </div>
          </div>

          <div className="surface-card rounded-[1.75rem] p-6 text-slate-100 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Current session
            </p>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
                <p className="mt-2 text-lg font-semibold">
                  {isAuthenticated ? "Authenticated" : "Signed out"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">User</p>
                <p className="mt-2 text-lg font-semibold">
                  {user?.name || "No active user"}
                </p>
                <p className="mt-1 text-sm text-slate-300">{user?.email || "Login required"}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

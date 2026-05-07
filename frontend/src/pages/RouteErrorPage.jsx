import { Link, isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

export default function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Something went wrong";
  let description = "An unexpected error interrupted the current screen.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    description = error.data?.message || description;
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="glass-panel w-full max-w-2xl rounded-[2rem] p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
          Route fallback
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">{description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate(0)}
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Retry page
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}


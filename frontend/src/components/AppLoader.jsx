export default function AppLoader({ label = "Loading StudyVault AI..." }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="glass-panel w-full max-w-md rounded-[2rem] p-8 text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-cyan-300/20 border-t-cyan-300" />
        <p className="mt-6 text-lg font-semibold text-white">{label}</p>
        <p className="mt-2 text-sm text-slate-400">
          Preparing your workspace and restoring the current session.
        </p>
      </div>
    </main>
  );
}


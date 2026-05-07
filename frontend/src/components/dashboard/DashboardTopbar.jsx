import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNotes } from "../../hooks/useNotes";
import { MenuIcon, UploadIcon } from "./Icons";
import SearchBar from "./SearchBar";

const pageMeta = {
  "/dashboard": {
    title: "Dashboard overview",
    subtitle: "Track uploads, search notes instantly, and manage your study archive.",
  },
  "/dashboard/upload": {
    title: "Upload notes",
    subtitle: "Add new documents, extract text, and keep everything indexed securely.",
  },
  "/dashboard/notes": {
    title: "My notes",
    subtitle: "Review uploaded files, inspect extracted text, and remove notes you no longer need.",
  },
  "/dashboard/ai-summary": {
    title: "AI summary",
    subtitle: "Generate concise revision sheets, concept lists, and exam-focused explanations.",
  },
  "/dashboard/quiz": {
    title: "Quiz generator",
    subtitle: "Create a timed MCQ practice session based on your uploaded notes.",
  },
  "/dashboard/flashcards": {
    title: "Flashcards",
    subtitle: "Study with interactive Q&A cards generated from your notes.",
  },
};

export default function DashboardTopbar({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();
  const { filteredNotes } = useNotes();
  const meta = pageMeta[location.pathname] || pageMeta["/dashboard"];

  return (
    <header className="space-y-6">
      <div className="glass-panel flex flex-col gap-4 rounded-[1.75rem] p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/70 text-slate-200 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              {meta.title}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {meta.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{meta.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Signed in as</p>
            <p className="mt-1 text-sm font-semibold text-white">{user?.name}</p>
          </div>
          <Link
            to="/dashboard/upload"
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <UploadIcon className="h-4 w-4" />
            Upload note
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 shadow-lg shadow-slate-950/10">
          {filteredNotes.length} matching note{filteredNotes.length === 1 ? "" : "s"}
        </div>
      </div>
    </header>
  );
}

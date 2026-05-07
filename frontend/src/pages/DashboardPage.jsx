import { Link, useNavigate } from "react-router-dom";
import AIActivityList from "../components/dashboard/AIActivityList";
import InlineStatusCard from "../components/dashboard/InlineStatusCard";
import QuickAiActions from "../components/dashboard/QuickAiActions";
import RecentUploadsList from "../components/dashboard/RecentUploadsList";
import StatsCards from "../components/dashboard/StatsCards";
import UploadCard from "../components/dashboard/UploadCard";
import { useAI } from "../hooks/useAI";
import { useNotes } from "../hooks/useNotes";

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    stats,
    recentNotes,
    isLoading,
    notesError,
    openNote,
    deleteNote,
    fetchNotes,
    isDeletingNoteId,
  } = useNotes();
  const { aiStats, recentAiActivity, isLoadingAiActivity, aiError, refreshAiActivity } = useAI();

  const handleOpenRecentNote = async (noteId) => {
    await openNote(noteId);
    navigate("/dashboard/notes");
  };

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} aiStats={aiStats} isLoading={isLoading || isLoadingAiActivity} />

      {notesError ? (
        <InlineStatusCard
          title="Notes could not be loaded"
          description={notesError}
          tone="error"
          actionLabel="Retry notes"
          onAction={fetchNotes}
        />
      ) : null}

      {aiError ? (
        <InlineStatusCard
          title="AI activity is temporarily unavailable"
          description={aiError}
          tone="error"
          actionLabel="Retry AI"
          onAction={refreshAiActivity}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <UploadCard />

        <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Quick glance
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Your study vault</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Keep notes organized in one place, search extracted content instantly, and return
            to the files you uploaded most recently.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
              <p className="text-sm text-slate-400">Search coverage</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.totalNotes}</p>
              <p className="mt-2 text-sm text-slate-500">Indexed uploads in your private library</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
              <p className="text-sm text-slate-400">Weekly activity</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.uploadsThisWeek}</p>
              <p className="mt-2 text-sm text-slate-500">Uploads recorded over the last 7 days</p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-cyan-400/15 bg-cyan-400/5 p-5">
            <p className="text-sm font-semibold text-cyan-200">Demo-ready flow</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Start with note upload, move into AI summary generation, then finish with a quiz
              or flashcard demo for a clean presentation sequence.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/dashboard/notes"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
            >
              View all notes
            </Link>
            <Link
              to="/dashboard/upload"
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Open upload workspace
            </Link>
            <Link
              to="/dashboard/ai-summary"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
            >
              Open AI summary
            </Link>
          </div>
        </section>
      </div>

      <QuickAiActions />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <RecentUploadsList
          notes={recentNotes}
          isLoading={isLoading}
          onOpen={handleOpenRecentNote}
          onDelete={deleteNote}
          deletingNoteId={isDeletingNoteId}
          title="Recent uploads"
        />

        <AIActivityList activity={recentAiActivity} isLoading={isLoadingAiActivity} />
      </div>
    </div>
  );
}

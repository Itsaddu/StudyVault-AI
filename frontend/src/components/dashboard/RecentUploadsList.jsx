import { memo } from "react";
import { FileIcon, TrashIcon } from "./Icons";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const formatBytes = (bytes) => {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

function RecentUploadsList({
  notes,
  isLoading,
  onOpen,
  onDelete,
  deletingNoteId,
  title = "Recent uploads",
}) {
  return (
    <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Library
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{title}</h3>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-[1.4rem] border border-white/5 bg-white/5"
              />
            ))
          : null}

        {!isLoading && notes.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/40 px-5 py-10 text-center">
            <p className="text-lg font-semibold text-white">No notes found</p>
            <p className="mt-2 text-sm text-slate-400">
              Upload your first study file to start building a searchable archive.
            </p>
          </div>
        ) : null}

        {!isLoading
          ? notes.map((note) => (
              <article
                key={note.id}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4 transition hover:border-cyan-300/30 hover:bg-slate-950/80"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <button
                    type="button"
                    onClick={() => onOpen(note.id)}
                    className="flex flex-1 items-start gap-4 text-left"
                  >
                    <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                      <FileIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{note.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{note.originalFileName}</p>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {note.extractedTextPreview || "No extracted text preview available."}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-3 md:flex-col md:items-end">
                    <div className="text-sm text-slate-400">
                      <p>{formatDate(note.uploadDate)}</p>
                      <p className="mt-1">{formatBytes(note.fileSize)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDelete(note.id)}
                      disabled={deletingNoteId === note.id}
                      className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/20 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <TrashIcon className="h-4 w-4" />
                      {deletingNoteId === note.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))
          : null}
      </div>
    </section>
  );
}

export default memo(RecentUploadsList);

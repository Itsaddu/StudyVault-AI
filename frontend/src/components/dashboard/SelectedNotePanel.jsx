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

export default function SelectedNotePanel({ note, isLoading, onClose }) {
  return (
    <aside className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Note details
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            {note?.title || "Select a note"}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          Close
        </button>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-3">
          <div className="h-6 w-40 animate-pulse rounded-xl bg-white/10" />
          <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-52 animate-pulse rounded-2xl bg-white/10" />
        </div>
      ) : null}

      {!isLoading && !note ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/40 px-5 py-10 text-center">
          <p className="text-lg font-semibold text-white">Nothing selected</p>
          <p className="mt-2 text-sm text-slate-400">
            Choose a note from the list to inspect extracted text and metadata.
          </p>
        </div>
      ) : null}

      {!isLoading && note ? (
        <div className="mt-6 space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Uploaded</p>
              <p className="mt-2 text-sm font-semibold text-white">{formatDate(note.uploadDate)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Size</p>
              <p className="mt-2 text-sm font-semibold text-white">{formatBytes(note.fileSize)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Original file</p>
            <p className="mt-2 text-sm font-semibold text-white">{note.originalFileName}</p>
            <p className="mt-1 text-xs text-slate-500">{note.mimeType}</p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/65 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Extracted text</p>
            <div className="mt-3 max-h-[360px] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {note.extractedText || "No text content could be extracted from this file."}
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}


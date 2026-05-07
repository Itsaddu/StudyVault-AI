import { useRef, useState } from "react";
import { UploadIcon } from "./Icons";
import { useNotes } from "../../hooks/useNotes";

const acceptedTypes = [".pdf", ".txt", ".docx"];

const formatBytes = (bytes) => {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

export default function UploadCard() {
  const inputRef = useRef(null);
  const { isUploading, uploadProgress, uploadNote } = useNotes();
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelection = (file) => {
    if (!file) {
      return;
    }

    setSelectedFile(file);
    if (!title.trim()) {
      const cleanedTitle = file.name.replace(/\.[^/.]+$/, "");
      setTitle(cleanedTitle);
    }
    setError("");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    handleFileSelection(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!selectedFile) {
      setError("Please choose a file to upload.");
      return;
    }

    try {
      await uploadNote({
        title: title.trim(),
        file: selectedFile,
      });

      setTitle("");
      setSelectedFile(null);
      setError("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (_error) {
      // Toasts already surface backend errors; local state keeps the form in place.
    }
  };

  return (
    <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Upload notes
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Add a study document</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Drag a PDF, TXT, or DOCX file into your personal vault. Text extraction runs during
            upload and becomes searchable right away.
          </p>
        </div>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="note-title">
            Note title
          </label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Operating Systems Revision Pack"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/60"
          />
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-[1.7rem] border border-dashed p-6 transition ${
            isDragging
              ? "border-cyan-300 bg-cyan-400/10"
              : "border-white/10 bg-slate-950/60 hover:border-cyan-300/40 hover:bg-white/5"
          }`}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-3xl bg-cyan-400/10 p-4 text-cyan-300">
              <UploadIcon className="h-8 w-8" />
            </div>
            <p className="mt-4 text-lg font-semibold text-white">
              Drag and drop your file here
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Supported formats: PDF, TXT, DOCX. Maximum size is enforced by the backend.
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-5 inline-flex items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-400/20"
            >
              Choose file
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={acceptedTypes.join(",")}
              onChange={(event) => handleFileSelection(event.target.files?.[0])}
              className="hidden"
            />
          </div>
        </div>

        {selectedFile ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4">
            <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
            <p className="mt-1 text-sm text-slate-400">
              {selectedFile.type || "Unknown type"} • {formatBytes(selectedFile.size)}
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {isUploading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Uploading</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Upload note"}
        </button>
      </form>
    </section>
  );
}


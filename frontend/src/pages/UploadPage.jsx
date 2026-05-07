import UploadCard from "../components/dashboard/UploadCard";

export default function UploadPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <UploadCard />

      <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
          Upload guide
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Accepted formats and flow</h3>
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-400">
          <p>1. Enter a clear title so the note is easy to find later.</p>
          <p>2. Upload a PDF, TXT, or DOCX file from your local device.</p>
          <p>3. The backend validates type and size before extracting text content.</p>
          <p>4. Uploaded notes become searchable in your dashboard immediately after success.</p>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-dashed border-cyan-300/20 bg-cyan-400/5 p-5">
          <p className="text-sm font-semibold text-cyan-200">Security</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Uploads are protected by JWT auth and stored per-user on the backend before note
            metadata and extracted text are saved to MongoDB.
          </p>
        </div>
      </section>
    </div>
  );
}


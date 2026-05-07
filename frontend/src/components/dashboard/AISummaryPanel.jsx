import { CopyIcon, DownloadIcon } from "./Icons";
import ProviderBadge from "./ProviderBadge";

export default function AISummaryPanel({
  summary,
  isLoading,
  onCopy,
  onDownloadTxt,
  onDownloadPdf,
}) {
  return (
    <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Summary output
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">AI study summary</h3>
          {summary ? (
            <div className="mt-3">
              <ProviderBadge
                provider={summary.providerUsed}
                model={summary.modelUsed}
                fallbackUsed={summary.fallbackUsed}
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onCopy}
            disabled={!summary}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CopyIcon className="h-4 w-4" />
            Copy
          </button>
          <button
            type="button"
            onClick={onDownloadTxt}
            disabled={!summary}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <DownloadIcon className="h-4 w-4" />
            TXT
          </button>
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={!summary}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <DownloadIcon className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-4">
          <div className="h-32 animate-pulse rounded-[1.4rem] bg-white/10" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-40 animate-pulse rounded-[1.4rem] bg-white/10" />
            <div className="h-40 animate-pulse rounded-[1.4rem] bg-white/10" />
          </div>
        </div>
      ) : null}

      {!isLoading && !summary ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/40 px-5 py-12 text-center">
          <p className="text-lg font-semibold text-white">No summary generated yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Choose one of your uploaded notes and generate an AI summary to start revising.
          </p>
        </div>
      ) : null}

      {!isLoading && summary ? (
        <div className="mt-6 space-y-4">
          <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Concise summary</p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {summary.summary}
            </p>
          </article>

          <div className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Key concepts</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                {summary.keyConcepts.map((item) => (
                  <li key={item} className="rounded-2xl bg-white/5 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Important points</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                {summary.importantPoints.map((item) => (
                  <li key={item} className="rounded-2xl bg-white/5 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <article className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(34,211,238,0.08),_rgba(14,165,233,0.03))] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Exam-focused explanation</p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {summary.examExplanation}
            </p>
          </article>
        </div>
      ) : null}
    </section>
  );
}

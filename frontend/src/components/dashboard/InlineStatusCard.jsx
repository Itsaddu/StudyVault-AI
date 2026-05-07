export default function InlineStatusCard({
  title,
  description,
  tone = "neutral",
  actionLabel,
  onAction,
}) {
  const toneClasses = {
    neutral: "border-white/10 bg-white/5 text-slate-200",
    error: "border-rose-400/25 bg-rose-500/10 text-rose-100",
    info: "border-cyan-400/25 bg-cyan-500/10 text-cyan-100",
  };

  return (
    <div className={`rounded-[1.5rem] border p-5 ${toneClasses[tone] || toneClasses.neutral}`}>
      <p className="text-base font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center justify-center rounded-2xl border border-current/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}


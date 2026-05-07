const providerLabels = {
  auto: "Auto",
  openai: "OpenAI",
  gemini: "Gemini",
  openrouter: "OpenRouter",
};

const providerTone = {
  auto: "border-slate-400/20 bg-slate-400/10 text-slate-200",
  openai: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  gemini: "border-sky-300/20 bg-sky-400/10 text-sky-200",
  openrouter: "border-violet-300/20 bg-violet-400/10 text-violet-100",
  fallback: "border-amber-300/20 bg-amber-400/10 text-amber-100",
};

export const getProviderLabel = (provider = "auto") => {
  return providerLabels[provider] || "AI";
};

export default function ProviderBadge({ provider = "auto", model = "", fallbackUsed = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
          providerTone[provider] || providerTone.auto
        }`}
      >
        {getProviderLabel(provider)}
      </span>
      {fallbackUsed ? (
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${providerTone.fallback}`}
        >
          Fallback
        </span>
      ) : null}
      {model ? (
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
          {model}
        </span>
      ) : null}
    </div>
  );
}

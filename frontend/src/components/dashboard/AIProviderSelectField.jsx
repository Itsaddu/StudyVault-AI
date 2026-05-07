const providerOptions = [
  {
    value: "auto",
    label: "Auto",
    description: "Use the configured fallback chain.",
  },
  {
    value: "openai",
    label: "OpenAI",
    description: "Try OpenAI first, then use the fallback chain.",
  },
  {
    value: "gemini",
    label: "Gemini",
    description: "Try Gemini first, then use the fallback chain.",
  },
  {
    value: "openrouter",
    label: "OpenRouter",
    description: "Use OpenRouter with a selected compatible model.",
  },
];

const openRouterModelOptions = [
  {
    value: "openai/gpt-oss-120b",
    label: "GPT-OSS-120B",
  },
  {
    value: "nvidia/nemotron-3-super",
    label: "NVIDIA Nemotron 3 Super",
  },
];

export default function AIProviderSelectField({ value, model, onChange, onModelChange }) {
  const selectedOption = providerOptions.find((option) => option.value === value) || providerOptions[0];

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-semibold text-slate-200">AI Provider</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-300/50"
        >
          {providerOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-950 text-white">
              {option.label}
            </option>
          ))}
        </select>
        <span className="mt-2 block text-xs leading-5 text-slate-500">
          {selectedOption.description}
        </span>
      </label>

      {value === "openrouter" ? (
        <label className="block">
          <span className="text-sm font-semibold text-slate-200">OpenRouter Model</span>
          <select
            value={model}
            onChange={(event) => onModelChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-300/50"
          >
            {openRouterModelOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-950 text-white">
                {option.label}
              </option>
            ))}
          </select>
          <span className="mt-2 block text-xs leading-5 text-slate-500">
            Model is sent only when OpenRouter is selected.
          </span>
        </label>
      ) : null}
    </div>
  );
}

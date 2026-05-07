import { memo } from "react";
import { BrainIcon, CardStackIcon, ChartIcon, FileIcon, QuizIcon, SparkIcon, UploadIcon } from "./Icons";

const formatStorage = (bytes) => {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const cardConfig = [
  {
    key: "totalNotes",
    label: "Total notes",
    accent: "from-cyan-400/20 to-cyan-500/5 text-cyan-200",
    icon: FileIcon,
  },
  {
    key: "totalStorageBytes",
    label: "Storage used",
    accent: "from-fuchsia-400/20 to-fuchsia-500/5 text-fuchsia-200",
    icon: ChartIcon,
    format: formatStorage,
  },
  {
    key: "uploadsThisWeek",
    label: "Uploads this week",
    accent: "from-emerald-400/20 to-emerald-500/5 text-emerald-200",
    icon: UploadIcon,
  },
  {
    key: "uniqueFileTypes",
    label: "File types",
    accent: "from-amber-400/20 to-amber-500/5 text-amber-200",
    icon: SparkIcon,
  },
  {
    key: "totalSummaries",
    label: "Summaries",
    accent: "from-sky-400/20 to-cyan-500/5 text-sky-200",
    icon: BrainIcon,
    source: "ai",
  },
  {
    key: "totalQuizzes",
    label: "Quizzes",
    accent: "from-fuchsia-400/20 to-purple-500/5 text-fuchsia-200",
    icon: QuizIcon,
    source: "ai",
  },
  {
    key: "totalFlashcardSets",
    label: "Flashcards",
    accent: "from-orange-400/20 to-amber-500/5 text-orange-100",
    icon: CardStackIcon,
    source: "ai",
  },
  {
    key: "totalOpenAiGenerations",
    label: "OpenAI runs",
    accent: "from-emerald-400/20 to-teal-500/5 text-emerald-100",
    icon: BrainIcon,
    source: "ai",
  },
  {
    key: "totalGeminiGenerations",
    label: "Gemini runs",
    accent: "from-sky-400/20 to-blue-500/5 text-sky-100",
    icon: SparkIcon,
    source: "ai",
  },
  {
    key: "totalOpenRouterGenerations",
    label: "OpenRouter runs",
    accent: "from-violet-400/20 to-indigo-500/5 text-violet-100",
    icon: SparkIcon,
    source: "ai",
  },
  {
    key: "fallbackGenerations",
    label: "Fallbacks",
    accent: "from-amber-400/20 to-orange-500/5 text-amber-100",
    icon: ChartIcon,
    source: "ai",
  },
];

function StatsCards({ stats, aiStats, isLoading }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cardConfig.map((card) => {
        const Icon = card.icon;
        const source = card.source === "ai" ? aiStats : stats;
        const value = card.format ? card.format(source?.[card.key]) : source?.[card.key];

        return (
          <article
            key={card.key}
            className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${card.accent} p-5 shadow-[0_20px_60px_rgba(2,6,23,0.24)]`}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-slate-300">{card.label}</p>
              <div className="rounded-2xl bg-white/10 p-3">
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {isLoading ? (
              <div className="mt-8 h-9 w-28 animate-pulse rounded-xl bg-white/10" />
            ) : (
              <p className="mt-8 text-3xl font-semibold tracking-tight text-white">{value}</p>
            )}
          </article>
        );
      })}
    </section>
  );
}

export default memo(StatsCards);

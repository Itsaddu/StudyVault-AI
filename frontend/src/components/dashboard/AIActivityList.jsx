import { memo } from "react";
import { BrainIcon, CardStackIcon, QuizIcon, SparkIcon } from "./Icons";
import ProviderBadge from "./ProviderBadge";

const activityConfig = {
  summary: {
    label: "Summary generated",
    icon: BrainIcon,
    accent: "text-cyan-300 bg-cyan-400/10",
  },
  quiz: {
    label: "Quiz generated",
    icon: QuizIcon,
    accent: "text-fuchsia-300 bg-fuchsia-400/10",
  },
  flashcards: {
    label: "Flashcards generated",
    icon: CardStackIcon,
    accent: "text-amber-200 bg-amber-400/10",
  },
};

const formatDateTime = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

function AIActivityList({ activity, isLoading }) {
  return (
    <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
          <SparkIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            AI activity
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Recent generations</h3>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-[1.35rem] border border-white/5 bg-white/5"
              />
            ))
          : null}

        {!isLoading && activity.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/40 px-5 py-10 text-center">
            <p className="text-lg font-semibold text-white">No AI activity yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Generate a summary, quiz, or flashcard deck from one of your notes to see it here.
            </p>
          </div>
        ) : null}

        {!isLoading
          ? activity.map((entry) => {
              const config = activityConfig[entry.type];
              const Icon = config.icon;

              return (
                <article
                  key={entry.id}
                  className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-white/10 bg-slate-950/55 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-2xl p-3 ${config.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{config.label}</p>
                      <p className="mt-1 text-sm text-slate-400">{entry.noteTitle}</p>
                      <div className="mt-2">
                        <ProviderBadge
                          provider={entry.providerUsed}
                          model={entry.modelUsed}
                          fallbackUsed={entry.fallbackUsed}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {formatDateTime(entry.createdAt)}
                  </p>
                </article>
              );
            })
          : null}
      </div>
    </section>
  );
}

export default memo(AIActivityList);

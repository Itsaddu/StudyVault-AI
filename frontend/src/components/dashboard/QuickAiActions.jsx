import { Link } from "react-router-dom";
import { BrainIcon, CardStackIcon, QuizIcon } from "./Icons";

const actions = [
  {
    label: "Generate summary",
    description: "Turn a note into a concise revision sheet with key concepts.",
    path: "/dashboard/ai-summary",
    icon: BrainIcon,
    accent: "from-cyan-400/20 to-blue-500/10 text-cyan-200",
  },
  {
    label: "Build quiz",
    description: "Create 10 exam-style MCQs with answers and difficulty tags.",
    path: "/dashboard/quiz",
    icon: QuizIcon,
    accent: "from-fuchsia-400/20 to-violet-500/10 text-fuchsia-200",
  },
  {
    label: "Create flashcards",
    description: "Flip through AI-made study cards with focused Q&A wording.",
    path: "/dashboard/flashcards",
    icon: CardStackIcon,
    accent: "from-amber-400/20 to-orange-500/10 text-amber-100",
  },
];

export default function QuickAiActions() {
  return (
    <section className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
        AI tools
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-white">Quick study actions</h3>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.path}
              to={action.path}
              className={`rounded-[1.5rem] border border-white/10 bg-gradient-to-br ${action.accent} p-5 transition hover:-translate-y-0.5 hover:border-white/20`}
            >
              <div className="rounded-2xl bg-white/10 p-3 text-inherit w-fit">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-lg font-semibold text-white">{action.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{action.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}


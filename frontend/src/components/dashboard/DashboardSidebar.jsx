import { NavLink } from "react-router-dom";
import {
  BrainIcon,
  CardStackIcon,
  ChartIcon,
  CloseIcon,
  FileIcon,
  QuizIcon,
  SparkIcon,
  UploadIcon,
  UserIcon,
} from "./Icons";
import { useAuth } from "../../hooks/useAuth";

const navigationItems = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: ChartIcon,
    end: true,
  },
  {
    label: "Upload Notes",
    path: "/dashboard/upload",
    icon: UploadIcon,
  },
  {
    label: "My Notes",
    path: "/dashboard/notes",
    icon: FileIcon,
  },
  {
    label: "AI Summary",
    path: "/dashboard/ai-summary",
    icon: BrainIcon,
  },
  {
    label: "Quiz Generator",
    path: "/dashboard/quiz",
    icon: QuizIcon,
  },
  {
    label: "Flashcards",
    path: "/dashboard/flashcards",
    icon: CardStackIcon,
  },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/60 transition lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[88vw] flex-col border-r border-white/10 bg-slate-950/95 p-5 text-slate-100 shadow-2xl backdrop-blur-xl transition duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:max-w-none lg:translate-x-0 lg:p-6 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              StudyVault AI
            </p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">
              Study workspace
            </h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 lg:hidden"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-2 overflow-y-auto pr-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-900/80 p-4">
            <div className="flex items-center gap-3 text-cyan-300">
              <SparkIcon className="h-5 w-5" />
              <p className="text-sm font-medium">Secure upload space</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your notes and AI study materials stay isolated to your account and searchable from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

const toneClasses = {
  success: "border-emerald-400/30 bg-emerald-500/15 text-emerald-100",
  error: "border-rose-400/30 bg-rose-500/15 text-rose-100",
  info: "border-cyan-400/30 bg-cyan-500/15 text-cyan-100",
};

export default function ToastStack({ toasts }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-[280px] rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur transition duration-300 ${
            toneClasses[toast.type] || toneClasses.success
          }`}
        >
          <p className="font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

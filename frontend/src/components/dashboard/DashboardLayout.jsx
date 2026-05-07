import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import ToastStack from "./ToastStack";
import { useNotes } from "../../hooks/useNotes";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toasts } = useNotes();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b,_#020617_55%)] text-slate-100">
      <ToastStack toasts={toasts} />

      <div className="mx-auto flex min-h-screen max-w-[1720px]">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:pl-6">
          <div className="sticky top-0 z-20 pb-4 backdrop-blur-sm">
            <DashboardTopbar onMenuClick={() => setIsSidebarOpen(true)} />
          </div>

          <div className="mt-6 pb-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen text-slate-100">
      <Outlet />
    </div>
  );
}

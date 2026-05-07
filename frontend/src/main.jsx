import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppLoader from "./components/AppLoader";
import { router } from "./routes";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Suspense fallback={<AppLoader />}>
        <RouterProvider router={router} fallbackElement={<AppLoader />} />
      </Suspense>
    </AuthProvider>
  </React.StrictMode>
);

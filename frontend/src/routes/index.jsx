import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import RouteErrorPage from "../pages/RouteErrorPage";
import { AIProvider } from "../context/AIContext";
import { NotesProvider } from "../context/NotesContext";

const AISummaryPage = lazy(() => import("../pages/AISummaryPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const FlashcardsPage = lazy(() => import("../pages/FlashcardsPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const NotesPage = lazy(() => import("../pages/NotesPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const QuizGeneratorPage = lazy(() => import("../pages/QuizGeneratorPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const UploadPage = lazy(() => import("../pages/UploadPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "signup",
        element: <RegisterPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <NotesProvider>
              <AIProvider>
                <DashboardLayout />
              </AIProvider>
            </NotesProvider>
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "upload",
            element: <UploadPage />,
          },
          {
            path: "notes",
            element: <NotesPage />,
          },
          {
            path: "ai-summary",
            element: <AISummaryPage />,
          },
          {
            path: "quiz",
            element: <QuizGeneratorPage />,
          },
          {
            path: "flashcards",
            element: <FlashcardsPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

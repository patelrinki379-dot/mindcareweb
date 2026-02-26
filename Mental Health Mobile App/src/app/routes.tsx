import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/pages/Dashboard";
import { Workouts } from "./components/pages/Workouts";
import { Nutrition } from "./components/pages/Nutrition";
import { MoodTracker } from "./components/pages/MoodTracker";
import { Profile } from "./components/pages/Profile";
import { Login } from "./components/pages/Login";
import { Signup } from "./components/pages/Signup";
import { NotFound } from "./components/pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "workouts", Component: Workouts },
      { path: "nutrition", Component: Nutrition },
      { path: "mood", Component: MoodTracker },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { DashboardPage } from "@/pages/dashboard/ui/DashboardPage";
import { NotFoundPage } from "@/pages/not-found/ui/NotFoundPage";
import { AuthGuard } from "../guards/AuthGuard";
import { LoginPage } from "@/pages/auth/ui/LoginPage";

export const Router = () => (
  <Routes>
    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
    <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    <Route element={<AuthGuard />}>
      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
    </Route>
  </Routes>
);

import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";
import { DashboardPage } from "../../pages/dashboard/ui/DashboardPage";
import { NotFoundPage } from "../../pages/not-found/ui/NotFoundPage";

export const AppRouter = () => (
  <Routes>
    <Route path={ROUTES.HOME} element={<DashboardPage />} />
    <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
  </Routes>
);
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks";
import { ROUTES } from "@/shared/config";

export const AuthGuard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    navigate(ROUTES.LOGIN, { state: { from: location }, replace: true });
  }

  return <Outlet />;
};

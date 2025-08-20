import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/auth/hooks/useAuth";
import { ROUTES } from "@/shared/constants/routes";

export const AuthGuard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    navigate(ROUTES.LOGIN, { state: { from: location }, replace: true });
  }

  return <Outlet />;
};

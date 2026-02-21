import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const auth = useAppSelector((state) => state.auth);
  if (!auth.authenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;

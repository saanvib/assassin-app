import { getSessionToken, useDescope } from "@descope/react-sdk";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const sessionToken = getSessionToken();
  const sdk = useDescope();
  return !sessionToken || sdk.isJwtExpired(sessionToken) ? (
    <Navigate to="/"></Navigate>
  ) : (
    <Outlet />
  );
};

export default ProtectedRoutes;

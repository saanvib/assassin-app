import { getSessionToken, useDescope } from "@descope/react-sdk";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const sessionToken = getSessionToken();
  const sdk = useDescope();

  return !sdk.isJwtExpired(sessionToken) &&
    sdk.getJwtRoles(sessionToken).includes("admin") ? (
    <Outlet />
  ) : (
    <Navigate to="/"></Navigate>
  );
};

export default ProtectedRoutes;

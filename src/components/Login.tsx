import { ReactNode } from "react";
import { useDescope, useSession, useUser } from "@descope/react-sdk";
import { Descope } from "@descope/react-sdk";
import { getSessionToken } from "@descope/react-sdk";
import { Navigate } from "react-router-dom";

function Login() {
  const { isAuthenticated, isSessionLoading } = useSession();
  const { user, isUserLoading } = useUser();

  return (
    <>
      {!isAuthenticated && (
        <Descope
          flowId="sign-up-or-in"
          onSuccess={(e) => console.log(e.detail.user)}
          onError={(e) => console.log("Could not log in!")}
        />
      )}
      {!isUserLoading && isAuthenticated && (
        <>
          <Navigate to="/dashboard"></Navigate>
        </>
      )}
    </>
  );
}
export default Login;

import { useSession, useUser } from "@descope/react-sdk";
import { Descope } from "@descope/react-sdk";
import { Navigate } from "react-router-dom";
import "../App.css";

function Login() {
  const { isAuthenticated } = useSession();
  const { isUserLoading } = useUser();

  return (
    <>
      {!isAuthenticated && (
        <div className="loginBox"><Descope
          flowId="sign-up-or-in"
          onSuccess={(e) => console.log(e.detail.user)}
          onError={() => console.log("Could not log in!")}
        /></div>
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

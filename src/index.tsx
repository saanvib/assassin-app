import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import { AuthProvider } from "@descope/react-sdk";

// const projectId: string = process.env.REACT_APP_DESCOPE_PROJECT as unknown as string;
const projectId: string = "P2svDaVml78jK6ZXeHayxS0n64Li";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider projectId={projectId}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
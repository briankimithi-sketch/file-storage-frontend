import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserService from "./services/UserService";

export function Root() {
  const [status, setStatus] = useState("Connecting to Keycloak...");
  const [error, setError] = useState("");

  useEffect(() => {
    UserService.initKeycloak(
      () => {
        if (UserService.isLoggedIn()) {
          setStatus("Authenticated");
        } else {
          setStatus("Keycloak reachable, but user is not logged in.");
        }
      },
      (err) => {
        setError(err instanceof Error ? err.message : String(err));
        setStatus("Keycloak initialization failed");
      }
    );
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>File Storage</h1>
      <h2>Keycloak Status</h2>
      <p>
        <strong>{status}</strong>
      </p>

      {error && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#ffe5e5",
            color: "#900",
            borderRadius: "8px",
          }}
        >
          <strong>Error:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
        </div>
      )}

      {status === "Authenticated" && <App />}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
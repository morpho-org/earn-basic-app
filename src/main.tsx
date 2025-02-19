import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Update the Layout component to be a simple full-width container
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      backgroundColor: "#121212",
      minHeight: "100vh",
      width: "100%",
    }}
  >
    {children}
  </div>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Layout>
      <App />
    </Layout>
  </StrictMode>
);

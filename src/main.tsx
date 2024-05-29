import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import './firebase/index.ts';
import { AuthProvider } from "./providers/AuthProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

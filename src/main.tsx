import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import './firebase/index.ts';
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

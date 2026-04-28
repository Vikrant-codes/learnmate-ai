import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./context/AppContext"; // 👈 add this

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AppProvider>   {/* 👈 wrap here */}
      <App />
    </AppProvider>
  </React.StrictMode>
);
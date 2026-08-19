import React from "react";
import { createRoot } from "react-dom/client";
import { EfficiencyIndex } from "../app/efficiency-index";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EfficiencyIndex />
  </React.StrictMode>,
);

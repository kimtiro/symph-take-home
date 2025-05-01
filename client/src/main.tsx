import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import SecondPage from "./pages/SecondPage";
import ErrorPage from "./pages/ErrorPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/second" element={<SecondPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

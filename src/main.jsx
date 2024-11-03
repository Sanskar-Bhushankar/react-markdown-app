import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import 'katex/dist/katex.min.css'; // Import KaTeX CSS for math rendering

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


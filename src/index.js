import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <header>
      <h1>React Photo Album | Filter With Animation</h1>
      <a
        href="https://github.com/igordanchenko/react-photo-album"
        target="_blank"
        rel="noreferrer noopener"
      >
        GitHub
      </a>
      <a
        href="https://react-photo-album.com/"
        target="_blank"
        rel="noreferrer noopener"
      >
        Docs
      </a>
    </header>
    <main>
      <App />
    </main>
  </StrictMode>
);

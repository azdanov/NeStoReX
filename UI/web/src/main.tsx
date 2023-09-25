import React from "react";
import ReactDOM from "react-dom/client";

import { StoreProvider } from "./app/context/StoreProvider.tsx";
import { App } from "./app/layout/App.tsx";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
);

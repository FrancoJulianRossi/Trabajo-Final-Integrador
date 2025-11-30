import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.tsx";

async function init() {
  // Start MSW in development to mock backend calls so the frontend can be used
  // without running the real backend. To disable mocking, run the dev server
  // with `VITE_DISABLE_MSW=true` or remove this block.
  try {
    // Vite exposes import.meta.env.DEV for development checks
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (
      import.meta.env &&
      import.meta.env.DEV &&
      !import.meta.env.VITE_DISABLE_MSW
    ) {
      const { worker } = await import("./mocks/browser");
      await worker.start({ onUnhandledRequest: "bypass" });
      // Worker started — all network requests matching handlers will be intercepted
      // Helpful console message for debugging in the browser devtools
      // eslint-disable-next-line no-console
      console.info("MSW worker started (mocking enabled)");
    }
  } catch (e) {
    // If MSW fails to start, we still proceed to render the app.
    // Console message helps with debugging.
    // eslint-disable-next-line no-console
    console.warn("MSW failed to start or is not available.", e);
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();

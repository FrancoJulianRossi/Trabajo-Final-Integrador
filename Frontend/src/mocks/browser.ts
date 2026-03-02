import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// This worker will intercept fetch/XHR requests in the browser during development
export const worker = setupWorker(...handlers);

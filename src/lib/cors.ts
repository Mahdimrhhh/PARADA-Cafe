import { createMiddleware } from "@tanstack/react-start";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export const corsMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const res = await next();
    if (res && typeof res === "object" && "headers" in res) {
      Object.entries(corsHeaders).forEach(([key, value]) => {
        (res.headers as Headers).set(key, value);
      });
    }
    return res;
  },
);

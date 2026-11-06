import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" is for self-hosted Docker builds. On Vercel it breaks the
  // build's output file-tracing step, so skip it there (VERCEL is set by Vercel).
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
};

export default nextConfig;

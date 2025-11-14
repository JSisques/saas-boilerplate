"use client";

import { useSDK as useSDKHook } from "@repo/sdk/react";
import { useMemo } from "react";

/**
 * Hook to get or create SDK instance
 * This ensures we have a single SDK instance per app
 */
export function useSDK() {
  const sdk = useSDKHook({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100",
  });

  return useMemo(() => sdk, [sdk]);
}

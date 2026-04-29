"use client";

import { useEffect } from "react";

export function useAutoRefresh(callback: () => void, delayMs: number, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const timer = window.setInterval(callback, delayMs);
    return () => window.clearInterval(timer);
  }, [callback, delayMs, enabled]);
}

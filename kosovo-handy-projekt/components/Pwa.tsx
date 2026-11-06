"use client";
import { useEffect } from "react";

export default function Pwa() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let cancelled = false;

    async function warmSnapshot() {
      if (cancelled || !navigator.serviceWorker.controller) return;
      try {
        await fetch("/api/puntoret", { cache: "no-store" });
      } catch {
        /* offline */
      }
    }

    navigator.serviceWorker.addEventListener("controllerchange", warmSnapshot);
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready)
      .then(warmSnapshot)
      .catch(() => {});

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("controllerchange", warmSnapshot);
    };
  }, []);

  return (
    <a href="/offline.html" className="pwa-link">
      Lista offline
    </a>
  );
}
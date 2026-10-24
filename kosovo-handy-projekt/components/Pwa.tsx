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
    <aside style={{ padding: "1rem" }}>
      <a href="/offline.html">Lista për lexim pa internet</a>
    </aside>
  );
}
"use client";
import { useState } from "react";

type Gjendja = "idle" | "loading" | "success" | "denied" | "timeout" | "unavailable";

const MESAZHET: Record<Gjendja, string> = {
  idle: "",
  loading: "Po kerkojme vendndodhjen...",
  success: "Pozicioni u mor. Kontrolloje adresen para dergimit.",
  denied: "Leja u refuzua. Shkruaj adresen vete.",
  timeout: "Koha mbaroi. Provo serish ose shkruaj adresen vete.",
  unavailable: "Vendndodhja nuk eshte e disponueshme. Shkruaj adresen vete.",
};

export default function VendiPunes() {
  const [adresa, setAdresa] = useState("");
  const [gjendja, setGjendja] = useState<Gjendja>("idle");
  const [saktesia, setSaktesia] = useState<number | null>(null);

  function perdorVendndodhjen() {
    if (!("geolocation" in navigator)) {
      setGjendja("unavailable");
      return;
    }
    setGjendja("loading");
    setSaktesia(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setAdresa(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setSaktesia(accuracy);
        setGjendja("success");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) setGjendja("denied");
        else if (error.code === error.TIMEOUT) setGjendja("timeout");
        else setGjendja("unavailable");
      },
      { timeout: 10000 }
    );
  }

  return (
    <div className="space-y-2">
      <input
        name="adresa"
        value={adresa}
        onChange={(e) => setAdresa(e.target.value)}
        maxLength={200}
        placeholder="Adresa e punes (rruga, lagjja)"
        className="w-full border rounded-lg p-2 bg-transparent"
      />

      <button
        type="button"
        onClick={perdorVendndodhjen}
        disabled={gjendja === "loading"}
        className="button button-secondary"
      >
        Perdor vendndodhjen time
      </button>
      <p>{MESAZHET[gjendja]}</p>
      {saktesia !== null && <p>Saktesia: rreth {Math.round(saktesia)} m</p>}
    </div>
  );
}
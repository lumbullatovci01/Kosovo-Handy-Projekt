"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toggleFavorite } from "@/app/actions/favorites";

export default function FavoriteButton({
  handymanId,
  initialFavorite,
}: {
  handymanId: number;
  initialFavorite: boolean;
}) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [optimistic, setOptimistic] = useOptimistic(favorite, (_c, next: boolean) => next);
  const [isPending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  function change(next: boolean) {
    if (isPending) return;
    setFailed(false);

    startTransition(async () => {
      setOptimistic(next);
      const result = await toggleFavorite(handymanId, next);
      if (result.ok) {
        startTransition(() => setFavorite(next));
      } else {
        setFailed(true);
      }
    });
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => change(!optimistic)}
        disabled={isPending}
        aria-pressed={optimistic}
        className="button button-secondary disabled:opacity-60"
      >
        {optimistic ? "★ Ne te preferuarat" : "☆ Ruaj te preferuarat"}
      </button>

      {isPending && <p>Po ruhet...</p>}

      {failed && (
        <p role="alert" className="text-red-500">
          Ruajtja deshtoi. Gjendja u rikthye.{" "}
          <button type="button" onClick={() => change(!favorite)} className="underline">
            Provo perseri
          </button>
        </p>
      )}
    </div>
  );
}
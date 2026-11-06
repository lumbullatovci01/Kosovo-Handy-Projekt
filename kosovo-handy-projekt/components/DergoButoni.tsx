"use client";
import { useFormStatus } from "react-dom";

export default function DergoButoni() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="button button-primary w-full disabled:opacity-60"
    >
      {pending ? "Po dergohet..." : "Dergo kerkesen"}
    </button>
  );
}
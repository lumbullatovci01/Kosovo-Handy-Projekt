"use client";
import { useFormStatus } from "react-dom";

export default function DergoButoni() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
    >
      {pending ? "Po dergohet..." : "Dergo kerkesen"}
    </button>
  );
}
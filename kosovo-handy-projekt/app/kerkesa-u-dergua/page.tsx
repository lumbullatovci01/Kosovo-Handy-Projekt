import Link from "next/link";

export default function KerkesaUDergua() {
  return (
    <main className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mt-10">Kërkesa u dërgua ✅</h1>
      <p className="mt-2">Puntori do te ju kontaktojë së shpejti.</p>
      <Link href="/" className="inline-block mt-6 text-blue-500">
        ← Kthehu te lista
      </Link>
    </main>
  );
}
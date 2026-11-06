import { neon } from "@neondatabase/serverless";
import Link from "next/link";

export default async function KerkesaUDergua({
  searchParams,
}: {
  searchParams: Promise<{ puntori?: string }>;
}) {
  const { puntori } = await searchParams;
  const numId = Number(puntori);

  let name: string | null = null;
  let phone: string | null = null;

  if (puntori && Number.isInteger(numId)) {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`SELECT name, phone FROM handymen WHERE id = ${numId}`;
    if (rows[0]) {
      name = rows[0].name;
      phone = rows[0].phone;
    }
  }

  return (
    <main className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mt-10">Kerkesa u ruajt ✅</h1>
      <p className="mt-2">
        Kerkesa jote u ruajt ne sistem. Puntori nuk njoftohet automatikisht ende,
        prandaj per pergjigje te shpejte telefonoje direkt.
      </p>

      {name && phone && (
        <a
          href={`tel:${phone}`}
          className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Telefono {name}
        </a>
      )}

      <div>
        <Link href="/" className="inline-block mt-6 text-blue-500">
          ← Kthehu te lista
        </Link>
      </div>
    </main>
  );
}
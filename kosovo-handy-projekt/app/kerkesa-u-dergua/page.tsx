import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import Logo from "@/components/Logo";

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
    <main className="page-shell text-center">
      <div className="site-header text-left">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold mt-10">Kerkesa u ruajt ✅</h1>
      <p className="mt-2">
        Kerkesa jote u ruajt ne sistem. Puntori nuk njoftohet automatikisht ende,
        prandaj per pergjigje te shpejte telefonoje direkt.
      </p>

      {name && phone && (
        <a
          href={`tel:${phone}`}
          className="button button-primary inline-block mt-6"
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
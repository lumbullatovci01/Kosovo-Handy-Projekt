import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

export default async function PuntoriPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();

  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT * FROM handymen WHERE id = ${numId}`;
  const h = rows[0];
  if (!h) notFound();

  const session = await auth();
  const login = (session?.user as { login?: string } | undefined)?.login;
  const isOwner = !!login && login === h.owner_login;

  return (
    <main className="p-4 max-w-md mx-auto">
      <Link href="/" className="text-blue-500">
        ← Kthehu
      </Link>
      <h1 className="text-2xl font-bold mt-3">{h.name}</h1>
      <p>
        {h.trade} · {h.city}
      </p>
      <p>
        {h.price_per_hour}€/orë · ⭐ {h.rating}
      </p>

      <a
        href={`tel:${h.phone}`}
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Telefono
      </a>
      <Link
        href={`/puntori/${h.id}/kerko`}
        className="inline-block mt-4 ml-2 border px-4 py-2 rounded-lg"
      >
        Kërko shërbim
      </Link>
      {isOwner && (
        <Link
          href={`/puntori/${h.id}/ndrysho`}
          className="inline-block mt-4 ml-2 border px-4 py-2 rounded-lg"
        >
          Ndrysho çmimin
        </Link>
      )}
    </main>
  );
}
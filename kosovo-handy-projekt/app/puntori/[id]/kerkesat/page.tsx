import { neon } from "@neondatabase/serverless";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import Logo from "@/components/Logo";

export default async function KerkesatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();

  const session = await auth();
  const login = (session?.user as { login?: string } | undefined)?.login;
  if (!login) redirect("/");

  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT name, owner_login FROM handymen WHERE id = ${numId}`;
  const h = rows[0];
  if (!h) notFound();

  if (h.owner_login !== login) {
    return (
      <main className="page-shell">
        <div className="site-header">
          <Logo />
        </div>
       <p>Nuk ke leje per te pare kerkesat e ketij profili.</p>
        <Link href="/" className="text-blue-500">← Kthehu</Link>
      </main>
    );
  }

  const kerkesat = await sql`
    SELECT id, client_name, client_phone, city, address, preferred_date,
           description, created_at
    FROM requests
    WHERE handyman_id = ${numId}
    ORDER BY created_at DESC
  `;

  return (
    <main className="page-shell">
      <div className="site-header">
        <Logo />
      </div>
      <Link href={`/puntori/${numId}`} className="text-blue-500">← Kthehu</Link>
      <h1 className="text-2xl font-bold mt-3">Kerkesat per {h.name}</h1>

      {kerkesat.length === 0 && <p className="mt-4">Ende nuk ka kerkesa.</p>}

      {kerkesat.map((k) => (
        <div key={k.id} className="border rounded-lg p-3 mt-3">
          <div className="font-semibold">{k.client_name}</div>
          <div>{k.city}{k.address ? ` · ${k.address}` : ""}</div>
          <div>
            Data e deshiruar:{" "}
            {k.preferred_date
              ? new Date(k.preferred_date).toLocaleDateString("sq-AL")
              : "pa date"}
          </div>
          <p className="mt-1">{k.description}</p>
          <a href={`tel:${k.client_phone}`} className="text-blue-500">
            Telefono {k.client_phone}
          </a>
          <div className="text-sm opacity-70">
            {new Date(k.created_at).toLocaleString("sq-AL")}
          </div>
        </div>
      ))}
    </main>
  );
}
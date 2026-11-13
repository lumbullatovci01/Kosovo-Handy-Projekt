import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import AuthBar from "./AuthBar";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ profesioni?: string }>;
}) {
  const { profesioni } = await searchParams;
  const sql = neon(process.env.DATABASE_URL!);

  const trades = await sql`SELECT DISTINCT trade FROM handymen ORDER BY trade`;
  const handymen = profesioni
    ? await sql`
        SELECT * FROM handymen
        WHERE trade = ${profesioni}
        ORDER BY rating DESC NULLS LAST
        LIMIT 3
      `
    : await sql`
        SELECT h.* FROM handymen h
        ORDER BY
          (SELECT COUNT(*) FROM requests r WHERE r.handyman_id = h.id) DESC,
          h.rating DESC NULLS LAST
        LIMIT 3
      `;

  const chip = "border rounded-full px-3 py-1 text-sm";

  return (
    <main className="page-shell">
      <AuthBar />
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Gjej ndihmën që të duhet</h1>
        <p className="muted mt-1">Puntorë të besueshëm pranë teje.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href="/"
          className={`${chip} ${!profesioni ? "bg-blue-600 text-white" : ""}`}
        >
          Të gjithë
        </Link>
        {trades.map((t) => (
          <Link
            key={t.trade}
            href={`/?profesioni=${encodeURIComponent(t.trade)}`}
            className={`${chip} ${
              profesioni === t.trade ? "bg-blue-600 text-white" : ""
            }`}
          >
            {t.trade}
          </Link>
        ))}
      </div>

      <h2 className="font-semibold mb-2">
        {profesioni ? `${profesioni}: me te vleresuarit` : "Me te kerkuarit"}
      </h2>

      {handymen.map((h) => (
        <Link
          key={h.id}
          href={`/puntori/${h.id}`}
          className="card mb-3"
        >
          <div className="font-semibold text-lg">{h.name}</div>
          <div className="muted">
            {h.trade} · {h.city}
          </div>
          <div className="mt-2 font-medium">
            {h.price_per_hour}€/orë · ⭐ {h.rating}
          </div>
        </Link>
      ))}
    </main>
  );
}
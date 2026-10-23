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
    ? await sql`SELECT * FROM handymen WHERE trade = ${profesioni} ORDER BY rating DESC`
    : await sql`SELECT * FROM handymen ORDER BY rating DESC`;

  const chip = "border rounded-full px-3 py-1 text-sm";

  return (
    <main className="p-4 max-w-md mx-auto">
      <AuthBar />
      <h1 className="text-2xl font-bold mb-4">Kosovo Handy</h1>

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

      {handymen.map((h) => (
        <Link
          key={h.id}
          href={`/puntori/${h.id}`}
          className="block border rounded-lg p-3 mb-3"
        >
          <div className="font-semibold">{h.name}</div>
          <div>
            {h.trade} · {h.city}
          </div>
          <div>
            {h.price_per_hour}€/orë · ⭐ {h.rating}
          </div>
        </Link>
      ))}
    </main>
  );
}
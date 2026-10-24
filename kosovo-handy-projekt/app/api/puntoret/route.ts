import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

// Vetëm të dhënat publike. Pa telefon, pa pronar, pa sesion.
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const puntoret = await sql`
      SELECT id, name, trade, city, price_per_hour, rating
      FROM handymen ORDER BY rating DESC
    `;
    return Response.json({ puntoret }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Lista nuk mund të lexohet tani." }, { status: 503 });
  }
}
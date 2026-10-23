import { neon } from "@neondatabase/serverless";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function KerkoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();

  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT name, trade FROM handymen WHERE id = ${numId}`;
  const h = rows[0];
  if (!h) notFound();

  async function dergo(formData: FormData) {
    "use server";
    const emri = String(formData.get("emri") ?? "").trim();
    const telefoni = String(formData.get("telefoni") ?? "").trim();
    const qyteti = String(formData.get("qyteti") ?? "").trim();
    const data = String(formData.get("data") ?? "") || null;
    const pershkrimi = String(formData.get("pershkrimi") ?? "").trim();

    if (!emri || !telefoni || !qyteti || !pershkrimi) return;

    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO requests
        (handyman_id, client_name, client_phone, city, preferred_date, description)
      VALUES
        (${numId}, ${emri}, ${telefoni}, ${qyteti}, ${data}, ${pershkrimi})
    `;
    redirect("/kerkesa-u-dergua");
  }

  const input = "w-full border rounded-lg p-2 bg-transparent";

  return (
    <main className="p-4 max-w-md mx-auto">
      <Link href={`/puntori/${numId}`} className="text-blue-500">← Kthehu</Link>
      <h1 className="text-2xl font-bold mt-3">Kërko shërbim</h1>
      <p className="mb-4">{h.name} · {h.trade}</p>

      <form action={dergo} className="space-y-3">
        <input name="emri" placeholder="Emri juaj" required className={input} />
        <input name="telefoni" placeholder="Telefoni" required className={input} />
        <input name="qyteti" placeholder="Qyteti" required className={input} />
        <input name="data" type="date" className={input} />
        <textarea
          name="pershkrimi"
          placeholder="Përshkruaj punën që të duhet"
          required
          rows={4}
          className={input}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Dërgo kërkesën
        </button>
      </form>
    </main>
  );
}
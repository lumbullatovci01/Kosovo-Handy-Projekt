import { neon } from "@neondatabase/serverless";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import VendiPunes from "@/components/VendiPunes";
import DergoButoni from "@/components/DergoButoni";
import Logo from "@/components/Logo";

const MESAZHET_GABIMI: Record<string, string> = {
  fusha: "Plotesoji te gjitha fushat. Hapesirat bosh nuk llogariten.",
  telefoni: "Shkruaj nje numer telefoni te vlefshem, p.sh. +38344111222.",
  adresa: "Adresa eshte shume e gjate (maksimumi 200 shkronja).",
};

export default async function KerkoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ gabim?: string }>;
}) {
  const { id } = await params;
  const { gabim } = await searchParams;
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
    const adresa = String(formData.get("adresa") ?? "").trim() || null;
    const data = String(formData.get("data") ?? "") || null;
    const pershkrimi = String(formData.get("pershkrimi") ?? "").trim();

    if (!emri || !telefoni || !qyteti || !pershkrimi) {
      redirect(`/puntori/${numId}/kerko?gabim=fusha`);
    }
    if (!/^\+?[0-9 ()-]{6,20}$/.test(telefoni)) {
      redirect(`/puntori/${numId}/kerko?gabim=telefoni`);
    }
    if (adresa && adresa.length > 200) {
      redirect(`/puntori/${numId}/kerko?gabim=adresa`);
    }

    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO requests
        (handyman_id, client_name, client_phone, city, address, preferred_date, description)
      VALUES
        (${numId}, ${emri}, ${telefoni}, ${qyteti}, ${adresa}, ${data}, ${pershkrimi})
    `;
    redirect(`/kerkesa-u-dergua?puntori=${numId}`);
  }

  const input = "w-full border rounded-lg p-2 bg-transparent";
  const mesazhi = gabim ? MESAZHET_GABIMI[gabim] : undefined;

  return (
    <main className="page-shell">
      <div className="site-header">
        <Logo />
      </div>
      <Link href={`/puntori/${numId}`} className="text-blue-500">← Kthehu</Link>
      <h1 className="text-2xl font-bold mt-3">Kerko sherbim</h1>
      <p className="mb-4">{h.name} · {h.trade}</p>

      {mesazhi && (
        <p role="alert" className="mb-3 text-red-500">
          {mesazhi}
        </p>
      )}

      <form action={dergo} className="space-y-3">
        <input name="emri" placeholder="Emri juaj" required className={input} />
        <input name="telefoni" placeholder="Telefoni" required className={input} />
        <input name="qyteti" placeholder="Qyteti" required className={input} />
        <input name="data" type="date" className={input} />
        <textarea
          name="pershkrimi"
          placeholder="Pershkruaj punen qe te duhet"
          required
          rows={4}
          className={input}
        />

        <VendiPunes />

        <DergoButoni />
      </form>
    </main>
  );
}
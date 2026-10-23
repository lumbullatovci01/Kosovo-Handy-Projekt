import { neon } from "@neondatabase/serverless";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

export default async function NdryshoPage({
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
  const rows = await sql`SELECT * FROM handymen WHERE id = ${numId}`;
  const h = rows[0];
  if (!h) notFound();

  if (h.owner_login !== login) {
    return (
      <main className="p-4 max-w-md mx-auto">
        <p>Nuk ke leje ta ndryshosh këtë profil.</p>
        <Link href="/" className="text-blue-500">
          ← Kthehu
        </Link>
      </main>
    );
  }

  async function ruaj(formData: FormData) {
    "use server";
    const s = await auth();
    const l = (s?.user as { login?: string } | undefined)?.login;
    if (!l) return;

    const price = Number(formData.get("price"));
    if (!Number.isInteger(price) || price <= 0 || price > 1000) return;

    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      UPDATE handymen SET price_per_hour = ${price}
      WHERE id = ${numId} AND owner_login = ${l}
    `;
    redirect(`/puntori/${numId}`);
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <Link href={`/puntori/${numId}`} className="text-blue-500">
        ← Kthehu
      </Link>
      <h1 className="text-2xl font-bold mt-3">Ndrysho çmimin</h1>
      <form action={ruaj} className="space-y-3 mt-4">
        <input
          name="price"
          type="number"
          defaultValue={h.price_per_hour}
          className="w-full border rounded-lg p-2 bg-transparent"
        />
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg">
          Ruaj
        </button>
      </form>
    </main>
  );
}
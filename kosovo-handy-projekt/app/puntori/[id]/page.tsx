import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import Logo from "@/components/Logo";
import FavoriteButton from "@/components/FavoriteButton";

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

  let isFavorite = false;
  if (login) {
    const fav = await sql`
      SELECT 1 FROM favorites
      WHERE user_login = ${login} AND handyman_id = ${numId}
    `;
    isFavorite = fav.length > 0;
  }

  return (
    <main className="page-shell">
      <div className="site-header">
        <Logo />
      </div>
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

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`tel:${h.phone}`}
          className="button button-primary"
        >
          Telefono
        </a>
        <Link
          href={`/puntori/${h.id}/kerko`}
          className="button button-secondary"
        >
          Kërko shërbim
        </Link>
      </div>

      {login ? (
        <div className="mt-2">
          <FavoriteButton handymanId={numId} initialFavorite={isFavorite} />
        </div>
      ) : (
        <p className="mt-2">Hyr me GitHub per te ruajtur te preferuarat.</p>
      )}

      {isOwner && (
        <Link
          href={`/puntori/${h.id}/ndrysho`}
          className="button button-secondary mt-2 inline-block"
        >
          Ndrysho çmimin
        </Link>
      )}
    </main>
  );
}
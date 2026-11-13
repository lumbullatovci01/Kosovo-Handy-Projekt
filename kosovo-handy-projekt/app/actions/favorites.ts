"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function toggleFavorite(
  handymanId: number,
  makeFavorite: boolean
): Promise<{ ok: boolean }> {
  try {
    if (!Number.isInteger(handymanId)) return { ok: false };

    const session = await auth();
    const login = (session?.user as { login?: string } | undefined)?.login;
    if (!login) return { ok: false };

    const sql = neon(process.env.DATABASE_URL!);

    if (makeFavorite) {
      await sql`
        INSERT INTO favorites (user_login, handyman_id)
        VALUES (${login}, ${handymanId})
        ON CONFLICT DO NOTHING
      `;
    } else {
      await sql`
        DELETE FROM favorites
        WHERE user_login = ${login} AND handyman_id = ${handymanId}
      `;
    }

    revalidatePath(`/puntori/${handymanId}`);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
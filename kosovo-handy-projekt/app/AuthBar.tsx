import { auth, signIn, signOut } from "@/auth";

export default async function AuthBar() {
  const session = await auth();

  if (session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="flex items-center gap-3 mb-4"
      >
        <span>{session.user.name}</span>
        <button className="border rounded-lg px-3 py-1">Dil</button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
      className="mb-4"
    >
      <button className="bg-blue-600 text-white rounded-lg px-3 py-1">
        Hyr me GitHub
      </button>
    </form>
  );
}
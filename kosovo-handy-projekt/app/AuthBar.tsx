import { auth, signIn, signOut } from "@/auth";
import Logo from "@/components/Logo";

export default async function AuthBar() {
  const session = await auth();

  if (session?.user) {
    return (
      <header className="site-header">
        <Logo />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
          className="auth-actions"
        >
          <span className="user-name">{session.user.name}</span>
          <button className="button button-secondary">Dil</button>
        </form>
      </header>
    );
  }

  return (
    <header className="site-header">
      <Logo />
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button className="button button-primary">Hyr me GitHub</button>
      </form>
    </header>
  );
}
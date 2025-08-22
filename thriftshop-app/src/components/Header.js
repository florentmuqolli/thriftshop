import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between">
      <Link href="/">Logo</Link>
      <nav className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/products">Products</Link>
        {session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={() => signOut()}>Logout</button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}

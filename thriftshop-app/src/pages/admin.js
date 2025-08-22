import { useSession } from "next-auth/react";

export default function Admin() {
  const { data: session } = useSession();

  if (!session || session.user.role !== "admin") return <p className="p-6">Access denied.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <p>Here you can manage products, users, and content.</p>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our University Project</h1>
      <p className="mb-6">Explore products, manage your profile, and enjoy our features!</p>
      <div className="space-x-4">
        <Link href="/products" className="bg-blue-600 text-white px-4 py-2 rounded">Products</Link>
        <Link href="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded">Dashboard</Link>
      </div>
    </div>
  );
}

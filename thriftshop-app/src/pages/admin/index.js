import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  if (!session) return <p className="p-6">You must be logged in</p>;
  if (session.user.role !== "admin")
    return <p className="p-6 text-red-600">🚫 Access denied</p>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addProduct = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert("✅ Product added!");
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: "",
      });
    } else {
      const { error } = await res.json();
      alert("❌ Error: " + error);
    }
  };

  const promoteUser = async (e) => {
  e.preventDefault();
  const res = await fetch("/api/users/promote", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: promoteEmail }),
  });
  if (res.ok) {
    alert("✅ User promoted to admin!");
    setPromoteEmail("");
  } else {
    const { error } = await res.json();
    alert("❌ Error: " + error);
  }
};


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <form onSubmit={addProduct} className="space-y-4 max-w-md">
        {["name", "description", "price", "stock", "category", "image"].map((f) => (
          <input
            key={f}
            name={f}
            value={form[f]}
            onChange={handleChange}
            placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
            className="w-full border p-2 rounded"
          />
        ))}
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
          ➕ Add Product
        </button>
      </form>
    </div>
  );
}

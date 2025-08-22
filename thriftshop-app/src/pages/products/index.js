import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useState } from "react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Products() {
  const { data: session } = useSession();
  const { data, error, mutate } = useSWR("/api/products", fetcher);
  const [loading, setLoading] = useState(false);

  if (error) return <p className="p-6 text-red-600">❌ Error loading products</p>;
  if (!data) return <p className="p-6">Loading...</p>;

  const addFavorite = async (productId) => {
    if (!session) {
      alert("You must be logged in to add favorites");
      return;
    }
    setLoading(true);
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id, productId }),
    });
    setLoading(false);
    alert("Added to favorites!");
  };

  const removeFavorite = async (productId) => {
    if (!session) return;
    setLoading(true);
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id, productId }),
    });
    setLoading(false);
    alert("Removed from favorites!");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.data.map((p) => (
          <div key={p._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{p.name}</h2>
            <p className="text-gray-600 mb-2">${p.price}</p>
            <button
              onClick={() => addFavorite(p._id)}
              disabled={loading}
              className="bg-green-600 text-white px-3 py-1 rounded mr-2"
            >
              ❤️ Add Favorite
            </button>
            <button
              onClick={() => removeFavorite(p._id)}
              disabled={loading}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

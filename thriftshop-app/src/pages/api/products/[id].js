import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;  
  const { data: session } = useSession();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    if (!id) return; 

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        setError("Product not found.");
      }
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]); 

  const addFavorite = async () => {
    if (!session) {
      alert("You must be logged in to add favorites");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, productId: id }),
      });

      if (!res.ok) throw new Error("Failed to add favorite");
      alert("Added to favorites!");
    } catch (err) {
      alert(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, productId: id }),
      });

      if (!res.ok) throw new Error("Failed to remove favorite");
      alert("Removed from favorites!");
    } catch (err) {
      alert(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading product details...</p>;
  if (error) return <p className="p-6 text-red-600">❌ {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
      <div className="flex gap-6">
        <div className="w-1/2">
          <img src={product.image || "/default-product-image.jpg"} alt={product.name} className="w-full h-auto rounded-lg" />
        </div>
        <div className="w-1/2">
          <p className="text-gray-600 mb-4">${product.price}</p>
          <p className="mb-6">{product.description}</p>

          <div className="flex gap-4">
            <button
              onClick={addFavorite}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              ❤️ Add to Favorites
            </button>
            <button
              onClick={removeFavorite}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              ❌ Remove from Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

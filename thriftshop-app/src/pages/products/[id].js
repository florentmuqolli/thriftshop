import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNotification } from "../../context/NotificationContext";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import Link from "next/link";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;  
  const { data: session } = useSession();
  const { showSuccess, showError, showWarning } = useNotification();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageGallery, setImageGallery] = useState([]);

  const { cart, addToCart, updateQuantity } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(); 

  const fetchProduct = async () => {
    if (!id) return; 

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data.data);
        const images = [data.data.image || "/api/placeholder/600/600"];
        if (data.additionalImages) {
          images.push(...data.additionalImages);
        }
        setImageGallery(images);
      } else {
        setError("Product not found.");
        showError("Product not found.");
      }
    } catch (err) {
      setError("Failed to load product details.");
      showError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]); 

  const inCart = cart.find((item) => item.id === product?._id);
  const inWishlist = wishlist.find((item) => item.id === product?._id); 

  const handleAddToCart = () => {
    if (!session) {
      showWarning("You must be logged in to use wishlist", "Login Required");
      return;
    }

    if (!product) return;

    if (inCart) {
      updateQuantity(product._id, inCart.quantity + quantity);
      showSuccess(`Updated quantity of ${product.name} in cart!`);
    } else {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image || "/api/placeholder/600/600"
      });
      showSuccess(`${quantity} ${product.name} added to cart!`);
    }
  };

  const handleWishlistToggle = () => {
    if (!session) {
      showWarning("You must be logged in to use wishlist", "Login Required");
      return;
    }

    if (inWishlist) {
      removeFromWishlist(product._id);
      showSuccess("Removed from wishlist!");
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || "/api/placeholder/600/600",
      });
      showSuccess("Added to wishlist!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/products" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 inline-block"
            >
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <nav className="flex mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-purple-600 transition duration-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-purple-600 transition duration-300">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="bg-gray-100 rounded-xl p-4 mb-4 flex items-center justify-center h-96">
              <img
                src={imageGallery[selectedImage] || "/api/placeholder/600/600"}
                alt={product.name}
                className="max-h-80 object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5YzlkYTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                }}
              />
            </div>
            {imageGallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {imageGallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border-2 transition duration-300 ${
                      selectedImage === index ? "border-purple-600" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            {product.category && (
              <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full mb-4">
                {product.category}
              </span>
            )}

            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <div className="flex items-center mb-6">
              <span className="text-4xl font-bold text-purple-600">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through ml-3">${product.originalPrice}</span>
              )}
            </div>
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 10 
                  ? "bg-green-100 text-green-800" 
                  : product.stock > 0 
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description || "No description available."}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.condition && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Condition</h4>
                  <p className="text-gray-800">{product.condition}</p>
                </div>
              )}
              {product.brand && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Brand</h4>
                  <p className="text-gray-800">{product.brand}</p>
                </div>
              )}
              {product.size && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Size</h4>
                  <p className="text-gray-800">{product.size}</p>
                </div>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="w-10 h-10 bg-gray-100 rounded-l-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-16 h-10 text-center border-t border-b border-gray-300 focus:outline-none text-gray-500"
                />
                <button
                  onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-100 rounded-r-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {inCart ? (
                <Link
                  href="/cart"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  View Cart
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  Add to Cart
                </button>
              )}
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 border py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center ${
                  inWishlist
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Why you'll love this item</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sustainable choice - reduces fashion waste
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Quality inspected and verified
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Great value compared to new items
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
              <p className="text-gray-500">More products coming soon</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNotification } from "../../context/NotificationContext";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import Link from "next/link";

export default function Products() {
  const { data: session } = useSession();
  const { showSuccess, showError, showWarning } = useNotification();
  const hasFetched = useRef(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { cart, addToCart, updateQuantity } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(); 

  const categories = ["all", ...new Set(products.map(product => product.category).filter(Boolean))];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/products/products", {
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data.data || data);
        
        const maxPrice = Math.max(...(data.data || data).map(p => p.price), 1000);
        setPriceRange([0, maxPrice]);
      } else {
        const { error } = await res.json().catch(() => ({}));
        setError(error || "Failed to load products.");
        showError(error || "Failed to load products.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      showError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inCart = cart.find((item) => item.id === selectedProduct?._id);
  const inWishlist = wishlist.find((item) => item.id === selectedProduct?._id); 

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProducts();
    }
  }, []);

  const handleWishlistToggle = (product) => {
    if (!session) {
      showWarning("You must be logged in to use wishlist", "Login Required");
      return;
    }

    const inWishlist = wishlist.find((item) => item.id === product._id);

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


  const openQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const handleAddToCart = (product) => {
    if (!session) {
      showWarning("You must be logged in to use cart", "Login Required");
      return;
    }

    const inCart = cart.find((item) => item.id === product._id);

    if (inCart) {
      updateQuantity(product._id, inCart.quantity + 1);
      showSuccess(`Updated quantity of ${product.name} in cart!`);
    } else {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image || "/api/placeholder/600/600",
      });
      showSuccess(`${quantity} ${product.name} added to cart!`);
    }
  };


  if (loading && !products.length) {
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

  if (error && !products.length) {
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Products</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
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
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 mb-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Discover Unique Treasures</h1>
          <p className="text-xl mb-6 max-w-2xl mx-auto">Find pre-loved fashion items that tell a story and reduce waste</p>
          <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mb-6"></div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shop Products</h1>
            <p className="text-gray-600">Discover unique second-hand treasures</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Products
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-gray-700 shadow-sm"
                />
              </div>
            </div>
            
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-gray-700 shadow-sm"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== "all").map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 text-gray-700 shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range: <span className="text-purple-600 font-semibold">${priceRange[0]} - ${priceRange[1]}</span>
            </label>
            <div className="relative pt-2">
              <input
                type="range"
                min="0"
                max={Math.max(...products.map(p => p.price), 1000)}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>${Math.max(...products.map(p => p.price), 1000)}</span>
              </div>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== "all" || priceRange[1] < 1000
                ? "Try adjusting your search or filter criteria"
                : "No products available at the moment"}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setPriceRange([0, Math.max(...products.map(p => p.price), 1000)]);
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "/api/placeholder/300/300"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5YzlkYTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                  
                  <button
                    onClick={() => openQuickView(product)}
                    className="absolute top-3 left-3 bg-white/90 text-gray-700 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:bg-white hover:text-purple-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h4m14 0h4M12 2v4m0 14v4" />
                    </svg>
                  </button>

                  <button
                    onClick={ handleWishlistToggle }
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 shadow-md  "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white"`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill={"none"} 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {product.category && (
                    <div className="absolute bottom-3 left-3 bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                      {product.category}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 mb-2 truncate hover:text-purple-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                    {product.description || "No description available"}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-purple-600">${product.price}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                      product.stock > 10 
                        ? "bg-green-100 text-green-800" 
                        : product.stock > 0 
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {product.stock || 0} in stock
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openQuickView(product)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Quick View
                    </button>
                    
                    <Link
                      href={`/products/${product._id}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h4m14 0h4M12 2v4m0 14v4" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showQuickView && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Quick View</h2>
                  <button
                    onClick={() => setShowQuickView(false)}
                    className="text-gray-400 hover:text-gray-600 transition duration-300 p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center h-80">
                    <img
                      src={selectedProduct.image || "/api/placeholder/400/400"}
                      alt={selectedProduct.name}
                      className="max-h-64 object-contain rounded-lg"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5YzlkYTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
                    <div className="flex items-center mb-4">
                      <span className="text-3xl font-bold text-purple-600">${selectedProduct.price}</span>
                      {selectedProduct.originalPrice && (
                        <span className="text-lg text-gray-400 line-through ml-3">${selectedProduct.originalPrice}</span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-6">{selectedProduct.description || "No description available."}</p>

                    <div className="space-y-3 mb-6">
                      {selectedProduct.category && (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 w-20">Category:</span>
                          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                            {selectedProduct.category}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 w-20">Stock:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedProduct.stock > 10 
                            ? "bg-green-100 text-green-800" 
                            : selectedProduct.stock > 0 
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {selectedProduct.stock || 0} available
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddToCart(selectedProduct)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Add to Cart
                      </button>
                      
                      <Link
                        href={`/products/${selectedProduct._id}`}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
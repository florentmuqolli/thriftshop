import { useEffect, useState } from "react";
import { useNotification } from "../../context/NotificationContext";

export default function ProductsTab({ form, setForm, handleChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { showSuccess, showError, showWarning } = useNotification();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);


  const categories = ["all", ...new Set(products.map(product => product.category).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const fetchProducts = async (showNotification = false) => {
    setLoading(true);
    try {
      const res = await fetch("/api/products/products", {
        credentials: "include",
        headers: { "Cache-Control": "no-cache" }, 
      });
      const result = await res.json(); 

      if (res.status === 304) {
        showInfo("Users data not modified; using cached version", "Info");
        setLoading(false);
        return;
      }

      if (res.ok) {
        setProducts(result.data || []); 
        if (showNotification) showInfo("Products loaded successfully");
      } else {
        console.error("Failed to fetch products:", result.error);
        showError("Failed to load products");
      }
    } catch (error) {
      console.error("Network error fetching products:", error);
      showError("Network error while loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setImagePreview(form.image || "");
  }, [form.image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingProductId ? "PUT" : "POST";
    const url = editingProductId ? `/api/products/${editingProductId}` : "/api/products/products";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showSuccess(editingProductId ? "Product updated successfully!" : "Product added successfully!");
        setShowModal(false);
        setEditingProductId(null);
        setForm({ name: "", description: "", price: "", stock: "", category: "", image: "" });
        fetchProducts(); 
      } else {
        const { error } = await res.json();
        showError("Error: " + error);
      }
    } catch (err) {
      showError("Network error. Please try again.");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image,
    });
    setEditingProductId(product._id);
    setShowModal(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">Product Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-300"
            />
          </div>
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-300"
          >
            <option value="all">All Categories</option>
            {categories.filter(cat => cat !== "all").map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-gray-500 dark:text-gray-300 text-lg mb-2">No products found</p>
          <p className="text-gray-400 dark:text-gray-400 text-sm">
            {searchTerm || selectedCategory !== "all" 
              ? "Try adjusting your search or filter criteria" 
              : "Get started by adding your first product"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative">
                <img
                  src={product.image || "/api/placeholder/300/200"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5YzlkYTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                  }}
                />
                <div className="absolute top-2 right-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium px-2 py-1 rounded-full">
                  {product.category || "Uncategorized"}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1 truncate">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 h-10">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">${product.price}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stock > 10 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                      : product.stock > 0 
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}>
                    {product.stock} in stock
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setProductToDelete(product);
                      setShowDeleteModal(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-3">
              Delete Product
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-red-600 dark:text-red-400">"{productToDelete.name}"</span>? This action cannot be undone.
            </p>
            {productToDelete.image && (
              <div className="flex justify-center mb-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={productToDelete.image}
                    alt={productToDelete.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/products/${productToDelete._id}`, { method: "DELETE" });
                    if (res.ok) {
                      showSuccess("Product deleted successfully!");
                      fetchProducts();
                    } else {
                      const { error } = await res.json();
                      showError("Error: " + error);
                    }
                  } catch (err) {
                    showError("Network error. Please try again.");
                  } finally {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
              This action is permanent and cannot be reversed.
            </p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {editingProductId ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingProductId(null);
                    setForm({ name: "", description: "", price: "", stock: "", category: "", image: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "name", label: "Product Name", type: "text" },
                  { id: "price", label: "Price ($)", type: "number", min: "0", step: "0.01" },
                  { id: "stock", label: "Stock Quantity", type: "number", min: "0" },
                  { id: "category", label: "Category", type: "text" },
                  { id: "image", label: "Image URL", type: "url" },
                ].map((field) => (
                  <div key={field.id} className={field.id === "description" ? "md:col-span-2" : ""}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      value={form[field.id]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-300"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required
                      min={field.min}
                      step={field.step}
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-300"
                    placeholder="Enter product description"
                    required
                  />
                </div>
                {imagePreview && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5YzlkYTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbnZhbGlkIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                      }}
                    />
                  </div>
                )}

                <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProductId(null);
                      setForm({ name: "", description: "", price: "", stock: "", category: "", image: "" });
                    }}
                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingProductId ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
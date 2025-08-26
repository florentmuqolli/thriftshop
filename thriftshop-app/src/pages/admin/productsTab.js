export default function ProductsTab({ form, handleChange, addProduct }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Product</h2>
      <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: "name", label: "Product Name", type: "text" },
          { id: "price", label: "Price ($)", type: "number" },
          { id: "stock", label: "Stock Quantity", type: "number" },
          { id: "category", label: "Category", type: "text" },
          { id: "image", label: "Image URL", type: "url" },
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              value={form[field.id]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
            placeholder="Enter product description"
            required
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}

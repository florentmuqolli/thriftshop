import { useSession } from "next-auth/react";
import { useEffect,useState,useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNotification } from '../../context/NotificationContext';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("products");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [promoteEmail, setPromoteEmail] = useState("");
  const { showError, showWarning, showInfo } = useNotification();
  const hasFetchedUsers = useRef(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

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
      alert("✅ Product added successfully!");
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
      alert("✅ User promoted to admin successfully!");
      setPromoteEmail("");
    } else {
      const { error } = await res.json();
      alert("❌ Error: " + error);
    }
  };

  useEffect(() => {
  if (activeTab === "users" && !hasFetchedUsers.current) {
    hasFetchedUsers.current = true;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetch("/api/auth/users");

        if (res.ok) {
          const data = await res.json();
          setUsers(data);
          showInfo("Users loaded successfully", "Success");
        } else if (res.status === 403) {
          showError(
            "You don't have permission to view users. Please contact an administrator.",
            "Access Denied"
          );
        } else if (res.status === 401) {
          showWarning(
            "Your session has expired. Please log in again.",
            "Authentication Required"
          );
        } else if (res.status === 404) {
          showError(
            "The users endpoint was not found. Please try again later.",
            "Service Unavailable"
          );
        } else if (res.status >= 500) {
          showError(
            "Server error occurred while fetching users. Please try again later.",
            "Server Error"
          );
        } else {
          showError(
            "An unexpected error occurred. Please try again.",
            "Error"
          );
        }
      } catch (error) {
        showError(
          "Network error occurred. Please check your connection and try again.",
          "Connection Error"
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }
}, [activeTab]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-6">Please log in to access the admin dashboard.</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (session.user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-4">You don't have permission to access this page.</p>
            <p className="text-gray-600">Please contact an administrator if you believe this is an error.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl text-white p-8 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-purple-200">Manage your ThriftShop store</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">{session.user.name}</p>
                <p className="text-purple-200 text-sm">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("products")}
                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition duration-300 ${
                  activeTab === "products"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Products
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition duration-300 ${
                  activeTab === "users"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Users
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition duration-300 ${
                  activeTab === "analytics"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "products" && (
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
                    <div key={field.id} className={field.id === "description" ? "md:col-span-2" : ""}>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Product
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Manage Users</h2>
                <form onSubmit={promoteUser} className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Promote User to Admin</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="email"
                      value={promoteEmail}
                      onChange={(e) => setPromoteEmail(e.target.value)}
                      placeholder="Enter user's email"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Promote User
                    </button>
                  </div>
                </form>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700">Recent Users</h3>
                  </div>
                  <div className="p-6">
                    {loadingUsers ? (
                      <p className="text-gray-500">Loading users...</p>
                    ) : users.length === 0 ? (
                      <p className="text-gray-500">No users found</p>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.name || "N/A"}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.role === "admin"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Store Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">1,247</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-green-600">$24,832</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">3,482</p>
                    <p className="text-sm text-gray-600">Registered Users</p>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700">Sales Overview</h3>
                  </div>
                  <div className="p-6 text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p>Analytics dashboard coming soon</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
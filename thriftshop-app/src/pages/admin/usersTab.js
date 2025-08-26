import { useEffect, useRef } from "react";

export default function UsersTab({ users, setUsers, loadingUsers, setLoadingUsers, promoteEmail, setPromoteEmail, showError, showWarning, showInfo }) {
  const hasFetchedUsers = useRef(false);

  useEffect(() => {
    if (!hasFetchedUsers.current) {
      hasFetchedUsers.current = true;

      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const res = await fetch("/api/auth/users", { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setUsers(data);
            showInfo("Users loaded successfully", "Success");
          } else if (res.status === 403) {
            showError("You don't have permission to view users. Please contact an administrator.", "Access Denied");
          } else if (res.status === 401) {
            showWarning("Your session has expired. Please log in again.", "Authentication Required");
          } else if (res.status === 404) {
            showError("The users endpoint was not found. Please try again later.", "Service Unavailable");
          } else if (res.status >= 500) {
            showError("Server error occurred while fetching users. Please try again later.", "Server Error");
          } else {
            showError("An unexpected error occurred. Please try again.", "Error");
          }
        } catch (error) {
          showError("Network error occurred. Please check your connection and try again.", "Connection Error");
        } finally {
          setLoadingUsers(false);
        }
      };

      fetchUsers();
    }
  }, []);

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

  return (
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
                          user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
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
  );
}

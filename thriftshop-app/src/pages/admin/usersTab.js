import { useEffect, useRef, useState } from "react";

export default function UsersTab({
  users,
  setUsers,
  loadingUsers,
  setLoadingUsers,
  showError,
  showWarning,
  showInfo
}) {
  const hasFetchedUsers = useRef(false);
  const [promoteEmail, setPromoteEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const fetchUsers = async (showNotification = false) => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/users/users", {
        credentials: "include",
        headers: { "Cache-Control": "no-cache" }, 
      });

      if (res.status === 304) {
        showInfo("Users data not modified; using cached version", "Info");
        setLoadingUsers(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || data);
        if (showNotification) showInfo("Users loaded successfully");
      } else if (res.status === 403) {
        showError("You don't have permission to view users. Please contact an administrator.", "Access Denied");
      } else if (res.status === 401) {
        showWarning("Your session has expired. Please log in again.", "Authentication Required");
      } else if (res.status === 404) {
        showError("The users endpoint was not found. Please try again later.", "Service Unavailable");
      } else if (res.status >= 500) {
        showError("Server error occurred while fetching users. Please try again later.", "Server Error");
      } else {
        const { error } = await res.json().catch(() => ({}));
        showError(error || "An unexpected error occurred. Please try again.", "Error");
      }
    } catch (error) {
      showError("Network error occurred. Please check your connection and try again.", "Connection Error");
    } finally {
      setLoadingUsers(false);
    }
  };


  useEffect(() => {
    if (!hasFetchedUsers.current) {
      hasFetchedUsers.current = true;
      fetchUsers();
    }
  }, []);

  const promoteUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/promote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: promoteEmail }),
      });

      console.log("Response status:", res.status);
      const text = await res.text();
      console.log("Raw response:", text);

      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (res.ok) {
        showInfo("User promoted to admin successfully!");
        setPromoteEmail("");
        fetchUsers();
      } else {
        showError(data.error || "Failed to promote user");
      }
    } catch (error) {
      console.error("Network error:", error);
      showError("Network error. Please try again.");
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, { method: "DELETE" });
      const raw = await res.text();

      let data = {};
      try { data = JSON.parse(raw); } catch {}

      if (res.ok) {
        showInfo(`User "${userToDelete.name}" deleted successfully!`);
        fetchUsers();
      } else {
        showError(data.error || `Failed to delete user (status ${res.status})`);
      }
    } catch (error) {
      console.error("Network error:", error);
      showError("Network error. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({...user});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingUser._id ? "PUT" : "POST";
    const url = editingUser._id ? `/api/users/${editingUser._id}` : `/api/users/users`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });

      const raw = await res.text();
      console.log("Save response:", res.status, raw);

      let data = {};
      try { data = JSON.parse(raw); } catch {}

      if (res.ok) {
        showInfo(editingUser._id ? "User updated successfully!" : "User added successfully!");
        setShowModal(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        showError(data.error || `Failed to save user (status ${res.status})`);
      }
    } catch (error) {
      console.error("Network error:", error);
      showError("Network error. Please try again.");
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">User Management</h2>
        <button
          onClick={() => {
            setEditingUser({ name: "", email: "", role: "user" });
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add User
        </button>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl mb-6 border border-purple-100 dark:border-purple-800/30">
        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Promote User to Admin
        </h3>
        <form onSubmit={promoteUser} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="email"
              value={promoteEmail}
              onChange={(e) => setPromoteEmail(e.target.value)}
              placeholder="Enter user's email address"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Promote User
          </button>
        </form>
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
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-300"
            />
          </div>
        </div>
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-300"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 dark:bg-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-500">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            User List
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {loadingUsers ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || roleFilter !== "all" 
                  ? "No users match your search criteria" 
                  : "No users found"}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                          {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin" 
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" 
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg transition-all duration-300 text-xs font-medium flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete({ id: user._id, name: user.name || user.email });
                            setShowDeleteModal(true);
                          }}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-lg transition-all duration-300 text-xs font-medium flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {editingUser._id ? "Edit User" : "Add New User"}
              </h3>
              <button
                onClick={() => { setShowModal(false); setEditingUser(null); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={editingUser.name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-300"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-300"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={editingUser.role || "user"}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-300"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingUser(null); }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {editingUser._id ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && userToDelete && (
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
              Delete User
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-red-600 dark:text-red-400">"{userToDelete.name}"</span>? This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
            
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
              This will permanently remove the user account and all associated data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
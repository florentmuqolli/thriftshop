// pages/admin/contactTab.js
import { useEffect, useState } from "react";
import { useNotification } from "@/context/NotificationContext";

export default function ContactTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact/contact");
      const result = await res.json();

      if (res.ok) {
        setMessages(result.data || []);
      } else {
        showError(result.error || "Failed to load messages");
      }
    } catch (err) {
      console.error("Error fetching contact messages:", err);
      showError("Network error while loading messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Contact Messages</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : messages.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300 text-center">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-white">{msg.subject}</h3>
                <span className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{msg.message}</p>
              <p className="text-xs text-gray-500">
                From: <span className="font-medium">{msg.name}</span> ({msg.email})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

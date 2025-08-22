import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) return <p className="p-6">You must be logged in to view this page.</p>;

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p>Name: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
      <button className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">Update Profile</button>
    </div>
  );
}

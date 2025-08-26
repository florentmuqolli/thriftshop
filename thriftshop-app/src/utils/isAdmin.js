import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export async function isAdmin(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.role || session.user.role !== "admin") {
    res.status(403).json({ success: false, error: "Access denied" });
    return null;
  }

  return session.user;
}

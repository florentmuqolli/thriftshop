import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { isAdmin } from "@/utils/isAdmin";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  const adminUser = await isAdmin(req, res);
  if (!adminUser) {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

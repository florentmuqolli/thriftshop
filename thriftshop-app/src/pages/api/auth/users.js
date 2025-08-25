import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { isAdmin } from "@/utils/isAdmin";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      const adminUser = await isAdmin(req, res);
      if (!adminUser) return res.status(403).json({ success: false, error: "Access denied" }); 

      try {
        const users = await User.find({}, "-passwordHash"); 
        return res.status(200).json({ success: true, data: users });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    default:
      return res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { isAdmin } from "@/utils/isAdmin";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case "GET":
      const adminUser = await isAdmin(req, res);
      if (!adminUser) return;

      try {
        const users = await User.find({}, "-passwordHash"); 
        return res.status(200).json({ success: true, data: users });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case "POST":
      const adminForPost = await isAdmin(req, res);
      if (!adminForPost) return;

      try {
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json({ success: true, data: newUser });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    default:
      return res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { isAdmin } from "@/utils/isAdmin";

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;
  const { id } = query;

  switch (method) {
    case "GET":
      const admin = await isAdmin(req, res);
      if (!admin) return;
      try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, error: "User not found" });
        return res.status(200).json({ success: true, data: user });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    case "PUT":
      const adminForPut = await isAdmin(req, res);
      if (!adminForPut) return;

      try {
        const { id } = req.query;
        const updateData = req.body;
        if (!id) return res.status(400).json({ success: false, error: "User ID is required" });
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-passwordHash");
        if (!updatedUser) return res.status(404).json({ success: false, error: "User not found" });

        return res.status(200).json({ success: true, data: updatedUser });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    case "DELETE":
      const adminForDelete = await isAdmin(req, res);
      if (!adminForDelete) return;

      try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ success: false, error: "User ID is required" });
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ success: false, error: "User not found" });
        return res.status(200).json({ success: true, data: deletedUser });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

import dbConnect from "@/utils/dbConnect";
import Favorite from "@/models/Favorite";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { userId } = req.query;
        const favorites = await Favorite.find({ userId }).populate("productId");
        res.status(200).json({ success: true, data: favorites });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const favorite = await Favorite.create(req.body);
        res.status(201).json({ success: true, data: favorite });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      try {
        const { userId, productId } = req.body;
        const deleted = await Favorite.findOneAndDelete({ userId, productId });
        if (!deleted) return res.status(404).json({ success: false, error: "Favorite not found" });
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}

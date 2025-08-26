import dbConnect from "@/utils/dbConnect";
import Product from "@/models/Product";
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
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ success: false, error: "Product not found" });
        return res.status(200).json({ success: true, data: product });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    case "PUT":
      const adminForPut = await isAdmin(req, res);
      if (!adminForPut) return;

      try {
        const { id } = req.query;
        const updateData = req.body;
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) return res.status(404).json({ success: false, error: "Product not found" });
        return res.status(200).json({ success: true, data: product });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    case "DELETE":
      const adminForDelete = await isAdmin(req, res);
      if (!adminForDelete) return;

      try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ success: false, error: "Product ID is required" });
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, error: "Product not found" });
        return res.status(200).json({ success: true, data: {} });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

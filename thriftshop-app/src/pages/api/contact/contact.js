// pages/api/contact/index.js
import dbConnect from "@/utils/dbConnect";
import Contact from "@/models/Contact"; 
import { isAdmin } from "@/utils/isAdmin";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case "GET": {
      const admin = await isAdmin(req, res);
      if (!admin) return;
      try {
        const messages = await Contact.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: messages });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    case "POST": {
      try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
          return res.status(400).json({ success: false, error: "All fields are required." });
        }

        const contact = await Contact.create({ name, email, subject, message });
        return res.status(201).json({ success: true, data: contact });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    default:
      return res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

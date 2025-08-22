import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
}, { timestamps: true });

export default mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);

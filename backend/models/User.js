
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String }, // Optional
  password: { type: String, required: true },
   role: { type: String, required: true }, 
});

export default mongoose.model("User", userSchema);

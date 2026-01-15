
import mongoose from "mongoose";

const authorizedUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  reportingTo: {
    type: String,
    required: true,
  },
});

const AuthorizedUser = mongoose.model("AuthorizedUser", authorizedUserSchema);
export default AuthorizedUser;

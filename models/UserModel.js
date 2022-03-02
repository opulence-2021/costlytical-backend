import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  addressLine1: String,
  addressLine2: String,
});

const UserModel = mongoose.model("UserModel", userSchema);

export default UserModel;

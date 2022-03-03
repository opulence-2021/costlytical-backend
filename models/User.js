import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  addressLine1: String,
  addressLine2: String,
  country: String,
  mobileNumber: Number,
});

const User = mongoose.model("User", userSchema);

export default User;

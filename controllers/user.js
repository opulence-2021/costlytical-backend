import UserModel from "../models/UserModel.js";
import crypto from "crypto";

//method to get a specific user's details //remove
export const getUser = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//method to get details of a user (ex-http://localhost:5000/user/login?mailAdress=olivia@gmail.com&password=12345678)
export const postLogin = async (req, res) => {
  try {
    let { mailAdress, password } = req.query;
    console.log(mailAdress, password);
    const userDocument = await UserModel.findOne({ email: mailAdress }).exec();

    if (userDocument !== null) {
      console.log(userDocument);
      const reqPasswordHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("base64");
      if (reqPasswordHash === userDocument.password) {
        userDocument.password = undefined;
        res.status(200).json(userDocument);
      } else {
        res.status(401).json({ error: "Invalid email address or password" });
      }
      return;
    } else {
      res.status(401).json({ error: "Invalid email address or password" });
    }
    res.status(401);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

import User from "../models/User.js";
import crypto from "crypto";

//method to get a specific user's details //remove
export const getUser = async (req, res) => {
  try {
    const users = await User.find();
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
    const userDocument = await User.findOne({ email: mailAdress }).exec();

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

//method to create a new user (ex-http://localhost:5000/user/createUser) + user details in the request body
export const createUser = async (req, res) => {
  let userDetails;
  let generatedPassword;

  if (!req.body) {
    return res.status(400).json({ error: "Invalid user details" });
  } else {
    try {
      userDetails = req.body;
      generatedPassword = crypto
        .createHash("sha256")
        .update(userDetails.password)
        .digest("base64");
      const reqUser = {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        password: generatedPassword,
        addressLine1: userDetails.addressLine1,
        addressLine2: userDetails.addressLine2,
        country: userDetails.country,
        mobileNumber: userDetails.mobileNumber,
      };
      // console.log(reqUser); //remove
      try {
        const newUser = new User(reqUser);
        await newUser.save();
        newUser.password = undefined;
        res.status(201).json(newUser);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
};

//package imports
import express from "express";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

//route imports
import userNameRoutes from "./routes/userName.js"; //remove
import projectRoutes from "./routes/projects.js";
import userRoutes from "./routes/user.js";
import modelRoutes from "./routes/models.js";

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());

app.use("/userName", userNameRoutes); //remove
app.use("/projects", projectRoutes);
app.use("/user", userRoutes);
app.use("/models", modelRoutes);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

//database connection URL => change to a .env_variyable later
const CONNECTION_URL =
  "mongodb+srv://costlyticalDB:pNGZTQ68GZein2vjBa@cluster0.f35s5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//server port
const PORT = process.env.PORT || 5000;
//mongoose setup
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT} ...`))
  )
  .catch((error) => console.log(error.message));
// mongoose.set("useFindAndModify", false); //chek produce an error

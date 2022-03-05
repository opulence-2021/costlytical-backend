import Project from "../models/Project.js";
import User from "../models/User.js";
import { path } from "../path.js"; // contain the absolute path of the index.js
import Fs from "fs";

//method to get a specific project/ project details  // check and remove not used in app
export const getProject = async (req, res) => {
  try {
    //add search for the project using quary String or params
    const project = await Project.find();
    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//method to add a new project(ex-http://localhost:5000/projects/createProject?userID=621f706680ab9c3b176f9bb6&projectname=Infusion pump)
export const createProject = async (req, res) => {
  let { userID, projectname } = req.query;
  console.log(userID, projectname); //remove
  const project = {
    projectName: projectname,
    projectStatus: "NEW",
    userId: userID,
  };
  console.log(project); //remove
  // can authorize the user using id - future improvement
  if (typeof userID === "undefined" || typeof projectname === "undefined") {
    return res.status(400).json({ error: "Invalid user id or project name" });
  }
  try {
    const newProject = new Project(project);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//method to upload models to a new project (ex-http://localhost:5000/projects/uploadModel?customerId=621f706680ab9c3b176f9bb6&projectId=621f706680ab9c3b176830284)
export const uploadModels = async (req, res) => {
  let { customerId, ProjectId } = req.query;
  console.log(customerId, ProjectId); //remove

  if (req.files === null) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  //code to create the project directory //recheck for sync property
  const dir = `./3Dmodels/${customerId}/${ProjectId}`;
  if (!Fs.existsSync(dir)) {
    Fs.mkdirSync(dir, { recursive: true });
  }
  const file = req.files.file;
  file.mv(`${path}/3Dmodels/${customerId}/${ProjectId}/${file.name}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res
      .status(200)
      .json({ fileName: file.name, filePath: `/projects/${file.name}` });
  });
};

import ProjectModel from "../models/ProjectModel.js";

//method to get a specific project/ project details
export const getProject = async (req, res) => {
  try {
    //add search for the project using quary String or params
    const Project = await ProjectModel.find();
    res.status(200).json(Project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//method to add a new project
export const createProject = (req, res) => {
  const project = req.body;
  const newProject = new ProjectModel(project);
  try {
    res.status(201).json(newProject);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

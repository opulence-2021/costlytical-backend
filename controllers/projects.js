import Project from "../models/Project.js";

//method to get a specific project/ project details
export const getProject = async (req, res) => {
  try {
    //add search for the project using quary String or params
    const project = await Project.find();
    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//method to add a new project
export const createProject = (req, res) => {
  const project = req.body;
  const newProject = new Project(project);
  try {
    res.status(201).json(newProject);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
  projectName: String,
  projectStatus: String,
  projectTotalCost: {
    type: Number,
    default: 0,
  },
  projectCreatedAt: {
    type: Date,
    default: new Date(),
  },
  userId: Number,
});

const ProjectModel = mongoose.model("ProjectModel", projectSchema);

export default ProjectModel;

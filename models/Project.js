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
  userId: String,
});

const Project = mongoose.model("Project", projectSchema);

export default Project;

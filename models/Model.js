import mongoose from "mongoose";

const modelSchema = mongoose.Schema({
  modelName: String,
  modelFileLocation: String,
  gCodeFileLocation: String,
  gCodeFileLocationSupport: String,
  modelQuantity: {
    type: Number,
    default: 1,
  },
  layerHeight: {
    type: Number,
    default: 0.28,
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  lineTotal: {
    type: Number,
    default: 0,
  },
  printabilityScore: {
    type: Number,
    default: 100,
  },
  materialName: {
    type: String,
    default: "PLA+",
  },
  projectId: String,
});

const Model = mongoose.model("model", modelSchema);

export default Model;

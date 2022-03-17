import Model from "../models/Model.js";
import fs from "fs";
import { path } from "../path.js"; // contain the absolute path of the index.js

// method to get model details that belongs to a specific project(ex-http://localhost:5000/models/createModel?projectID=sample13242343423423, and array of objects in the request body.)
export const getModels = async (req, res) => {
  let { projectID } = req.query;
  console.log(projectID); //remove
  if (typeof projectID != "undefined") {
    try {
      const models = await Model.find({ projectId: projectID }).exec();
      res.status(200).json(models);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid projectID" });
  }
};

// method to update the existing models details (quantity, layerHeight, material)(ex-http://localhost:5000/models/updateModels?projectID=sample13242343423423)
export const updateModels = async (req, res) => {
  let { projectID } = req.query; // check and remove
  console.log(projectID); //remove
  let models;

  if (typeof projectID != "undefined") {
    try {
      models = req.body;
      // console.log(models); //remove
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    try {
      for (let i = 0; i < models.length; i++) {
        let model = models[i];
        console.log(model.id); //remove
        let result = await Model.updateOne(
          { _id: model.id },
          {
            $set: {
              modelQuantity: model.modelQuantity,
              layerHeight: model.layerHeight,
              materialName: model.materialName,
            },
          }
        );
        // console.log(result.matchedCount); //remove
      }

      res.status(200).json({ message: "Models updated successfully" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid projectID" });
  }
};

//method to create a 3D model entry and save them to the database.(ex-http://localhost:5000/models/createModel?userID=5ewerewr&projectID=sample13242343423423)
export const createModel = async (req, res) => {
  try {
    let { userID, projectID } = req.query;
    console.log(userID, projectID); //remove

    if (typeof userID != "undefined" && typeof projectID != "undefined") {
      let projectFolder = `${path}/3Dmodels/${userID}/${projectID}`;
      let models = [];

      try {
        // should make this file reading part async, the code is bellow
        fs.readdirSync(projectFolder).forEach((file) => {
          let fileName = file;

          const model = {
            modelName: fileName,
            modelFileLocation: `3Dmodels/${userID}/${projectID}`,
            projectId: projectID,
          };

          try {
            const newModel = new Model(model);
            newModel.save();
          } catch (error) {
            res.status(409).json({ message: error.message });
          }
          models.push(model);
        });

        console.log(models); //remove
        res.status(200).json(models); // check and remove, no need to send the array of models
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    } else {
      res.status(400).json({ message: "Invalid userID or projectID" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }

  // fs.readdir(projectFolder, (err, files) =>{
  //   files.forEach((file) => {
  //     console.log(file); // remove
  //     modelNames.push(file);
  //   });
  // });
};

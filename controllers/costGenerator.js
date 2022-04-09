// module imports
import Model from "../models/Model.js";
import fs from "fs";
import child_process from "child_process";
import { path, sliceCommandHead, sliceCommandTail } from "../path.js"; // contain the absolute path of the index.js
import Project from "../models/Project.js";

let models; //3D models that belongs to the project
let selectedProjectId; //project id
let projectCost; //total cost of the project

//method to generate cost for models of a specific project.(ex-http://localhost:5000/generateCost?projectID=sample13242343423423)
export const generateCost = async (req, res) => {
  projectCost = 0;
  try {
    let { projectID } = req.query;
    selectedProjectId = projectID;
    console.log(projectID);
    if (typeof projectID != "undefined") {
      try {
        models = await Model.find({ projectId: projectID }).exec();

        try {
          await sliceModels();
        } catch (error) {
          return res
            .status(400)
            .json({ message: "An error occured while slicing" });
        }
        return res.status(200).json(models);
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    } else {
      return res.status(400).json({ message: "Invalid projectID" });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Slicer cofiguration paths
const config_File_Path_L_Sup = `${path}/slicer_Config_Files/config_0.28.ini`;
const config_File_Path_L_NoSup = `${path}/slicer_Config_Files/config_0.28 _NoSup.ini`;

const config_File_Path_M_Sup = `${path}/slicer_Config_Files/config_0.2.ini`;
const config_File_Path_M_NoSup = `${path}/slicer_Config_Files/config_0.2 _NoSup.ini`;

const config_File_Path_S_Sup = `${path}/slicer_Config_Files/config_0.12.ini`;
const config_File_Path_S_NoSup = `${path}/slicer_Config_Files/config_0.12_NoSup.ini`;

//method to handle slicing of the models
const sliceModels = async () => {
  for (let i = 0; i < models.length; i++) {
    const {
      _id,
      modelName,
      modelQuantity,
      layerHeight,
      materialName,
      projectId,
      modelFileLocation,
    } = models[i];

    //selecting the config file for proper layerheight
    let config_file;
    let config_file_support;
    if (layerHeight === 0.28) {
      config_file = config_File_Path_L_NoSup;
      config_file_support = config_File_Path_L_Sup;
    } else if (layerHeight === 0.2) {
      config_file = config_File_Path_M_NoSup;
      config_file_support = config_File_Path_M_Sup;
    } else {
      config_file = config_File_Path_S_NoSup;
      config_file_support = config_File_Path_S_Sup;
    }

    const dir = `./g_codes/${projectId}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let value = false,
      value2 = false;

    //1. function call to slice the model without support
    value = await sliceModel(
      config_file,
      `${path}/${modelFileLocation}/${modelName}`,
      `${path}/g_codes/${projectId}/${modelName}.gcode`
    );

    //2. function call to slice the model with support
    value2 = await sliceModel(
      config_file_support,
      `${path}/${modelFileLocation}/${modelName}`,
      `${path}/g_codes/${projectId}/${modelName}_supp.gcode`
    );

    console.log(value, value2);

    if (value && value2) {
      //3.function to get print time details without support
      const result = await getPrintDetails(
        `${path}/g_codes/${projectId}/${modelName}.gcode`
      );
      console.log(result); //remove

      //4.function call to get time details with support
      const result_support = await getPrintDetails(
        `${path}/g_codes/${projectId}/${modelName}_supp.gcode`
      );
      console.log(result_support); //remove

      //5.function call to calculate cost
      const { subTotal, lineTotal, printScore } = calculateCost(
        modelQuantity,
        materialName,
        result,
        result_support
      );

      // let subTotal = 0;   //remove for testing only
      // let lineTotal = 0;  //remove for testing only
      // let printScore = 100;   //remove for testing only

      console.log(subTotal, lineTotal, printScore); //remove
      projectCost = projectCost + subTotal;

      //6. function call to update model Database
      updateModelData(_id, subTotal, lineTotal, printScore);
    }
  }

  // 7. function call to update project Database
  updateProjectData(selectedProjectId);

  //doing the following for each model =>
  //   1. call function sliceModel to slice model with support;
  //   2. call function sliceModel to slice model without support;
  //   3. call function getPrintDetails to get model print details with support;
  //   4. call function getPrintDetails to get model print details without support;
  //   5. call function to getcost for printing
  //   6. call function to update db or update current value;
};

//method to slice the given model
//@pram stl_File_Path - path of the STL file
//@pram Gcode_File_Path - path of the Gcode file to be saved
//@pram config_File_Path - config file path for slicing
function sliceModel(config_File_Path, stl_File_Path, Gcode_File_Path) {
  //Path of the slicer root folder
  return new Promise((resolve) => {
    let command = `${sliceCommandHead} --slice --load "${config_File_Path}" --output "${Gcode_File_Path}" "${stl_File_Path}" && exit${sliceCommandTail}`;
    let process = child_process.spawn(command, [], { shell: true });

    process.on("close", (code) => {
      console.log("Sliced model finished with code: ", code);
      resolve(true);
    });
  });
}

//method to get time and mass from the gcode file using regex.
function getPrintDetails(gcode_path) {
  return new Promise((resolve) => {
    let massArr;
    let timeArr;
    var file = fs.readFile(gcode_path, "utf8", function (err, doc) {
      massArr = doc.match(/;\sfilament\sused\s\[g\]\s=\s[0-9*8\.*[0-9]*/g);
      timeArr = doc.match(
        /;\sestimated\sprinting\stime\s\(normal mode\)\s\=\s[0-9 ? a-z]*/g
      );
      getValues();
    });

    //function to get time in minutes and mass in grams
    let mass;
    let time;
    function getValues() {
      //getting mass from arr containing mass
      let massString = massArr[0];
      let massStringArr = massString.split(" ");
      mass = Number(massStringArr[massStringArr.length - 1]);

      //getting minutes from arr containing time
      let timeString = timeArr[0];
      let timeStringArr = timeString.split(" ");
      let minutesString = timeStringArr[timeStringArr.length - 2];
      minutesString = minutesString.replace("m", "");
      let minutes = Number(minutesString);
      //getting from arr containing time
      let hoursString = timeStringArr[timeStringArr.length - 3];
      let hours = 0;
      if (hoursString !== "=") {
        hoursString = hoursString.replace("h", "");
        hours = Number(hoursString);
      }
      time = hours * 60 + minutes;
      resolve({ time, mass });
    }
  });
}

//--------------------------------------------------------------------------
// Service provider given variables
const machineDepCost = 3; //machine depreciation per minute
const elecricityCost = 100; //cost per unit of electricity (kWh)
const PrinterPowerConsumption = 0.35; //cost per unit of electricity (kWh)
const labourCost = 225; //labour cost per hour
const profitMargin = 20; //PROFIT MARGIN
const PLAMaterialCost = 4; //cost of material per gram
const ABSMaterialCost = 5; //cost of material per gram
const PETGMaterialCost = 5; //cost of material per gram
const TPUMaterialCost = 8; //cost of material per gram
//----------------------------------------------------------------------------

//function to calculate cost
function calculateCost(modelQuantity, materialName, result, result_support) {
  // console.log("calculate cost"); //remove

  let printingTimeWithSupport = result_support.time;
  let massWithSupport = result_support.mass;
  let printingTimeWithoutSupport = result.time;
  let massWithoutSupport = result.mass;

  let printTime = printingTimeWithSupport; // total printing time of the model
  let mass = massWithSupport; //mass of the model
  let supportPrintingtime =
    printingTimeWithSupport - printingTimeWithoutSupport; //support material print time in minutes
  let supportmass = massWithSupport - massWithoutSupport; // mass of support material in grams

  //---------------------------------

  let machiningCost = calculateMachiningCost(printTime);
  let materialCost = calculatematerialCost(mass, materialName);
  let postProcessingCost = calculatepostProcessingCost(
    supportPrintingtime,
    supportmass
  );
  let printScore = calculatePrintabilityScore(printTime, supportPrintingtime);
  let lineTotal =
    (machiningCost + materialCost + postProcessingCost) *
    (1 + profitMargin / 100);
  lineTotal = Math.trunc(lineTotal);
  let subTotal = lineTotal * modelQuantity;
  return { subTotal, lineTotal, printScore };
}

//function to calculate machining cost
function calculateMachiningCost(printTime) {
  let machiningCost =
    (machineDepCost + (elecricityCost * PrinterPowerConsumption) / 60) *
    printTime;
  return machiningCost;
}

//function to calculate material cost
function calculatematerialCost(mass, materialName) {
  let rawMaterialCost;
  if (materialName === "PLA+") {
    rawMaterialCost = PLAMaterialCost;
  } else if (materialName === "ABS+") {
    rawMaterialCost = ABSMaterialCost;
  } else if (materialName === "PETG") {
    rawMaterialCost = PETGMaterialCost;
  } else {
    rawMaterialCost = TPUMaterialCost;
  }
  let materialCost = rawMaterialCost * mass;
  return materialCost;
}

//function to calculate post processing cost
function calculatepostProcessingCost(supportPrintingtime, supportmass) {
  const alpha = 2.1646;
  const beta = 0.1403;
  const gama = -0.404;

  let postProcessingTime =
    alpha + beta * supportPrintingtime + gama * supportmass;
  let postProcessingCost = postProcessingTime * (labourCost / 60);
  if (postProcessingCost < 0) {
    postProcessingCost = 0;
  }
  console.log(postProcessingCost);
  return postProcessingCost;
}

//function to calculate printScore
function calculatePrintabilityScore(printTime, supportPrintingtime) {
  let score = ((printTime - supportPrintingtime) / printTime) * 100;
  if (score > 100) {
    score = 100;
  }
  score = Math.trunc(score);
  return score;
}

//---------------------------------------------------------------------------

//function to update the model database
async function updateModelData(modelId, subTotal, LineTotal, printScore) {
  try {
    let result = await Model.updateOne(
      { _id: modelId },
      {
        $set: {
          subTotal: subTotal,
          lineTotal: LineTotal,
          printabilityScore: printScore,
        },
      }
    );
    return "Updated Successfully";
  } catch (error) {
    return error;
  }
}

//function to update the project database
async function updateProjectData(projectId) {
  try {
    let result2 = await Project.updateOne(
      { _id: projectId },
      {
        $set: {
          projectStatus: "pending confirmation",
          projectTotalCost: projectCost,
        },
      }
    );
    return "Updated Successfully";
  } catch (error) {
    return error;
  }
}

export function sum(a, b) {
  return a + b;
}

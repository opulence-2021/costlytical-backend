//absolute file path of indexjs
export const path = "C:/Users/ACER/Desktop/costlytical-backend";
export const certPath = "C:/Users/ACER/Desktop/costlytical-backend/cert";
//absolute file path of prusa Slicer
const prusaPath = "C:/Program Files/Prusa3D/PrusaSlicer";
//Command for slicing
export const sliceCommandHead = `start cmd.exe /K "cd /D ${prusaPath} && prusa-slicer-console`;
export const sliceCommandTail = `"`;

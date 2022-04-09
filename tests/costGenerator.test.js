import { sum } from "../controllers/costGenerator.js";
import { calculateMachiningCost } from "../controllers/costGenerator.js";
import { calculatematerialCost } from "../controllers/costGenerator.js";
import { calculatepostProcessingCost } from "../controllers/costGenerator.js";
import { calculatePrintabilityScore } from "../controllers/costGenerator.js";

//testing addtion of 2 numbers
test("should add two numbers test", () => {
  expect(sum(1, 2)).toBe(3);
});

//-----------------------------------------------------------------------

//testing machining cost calculation
test("machining cost calculation test", () => {
  expect(calculateMachiningCost(100)).toBe(358.33333333333337);
});

//-----------------------------------------------------------------------

//testing material cost calculation (PLA)
test("material cost calculation test (PLA)", () => {
  expect(calculatematerialCost(100, "PLA+")).toBe(400);
});

//testing material cost calculation (ABS)
test("material cost calculation test (ABS)", () => {
  expect(calculatematerialCost(100, "ABS+")).toBe(500);
});

//testing material cost calculation (PETG)
test("material cost calculation test (PETG)", () => {
  expect(calculatematerialCost(100, "PETG")).toBe(500);
});

//testing material cost calculation (TPU)
test("material cost calculation test (TPU)", () => {
  expect(calculatematerialCost(100, "TPU")).toBe(800);
});

//-----------------------------------------------------------------------

//testing post-processing cost calculation
test("post-processing cost calculation test", () => {
  expect(calculatepostProcessingCost(200, 30)).toBe(67.89225);
});

//-----------------------------------------------------------------------

//testing printability score calculation
test("printability score calculation test", () => {
  expect(calculatePrintabilityScore(1600, 100)).toBe(93);
});

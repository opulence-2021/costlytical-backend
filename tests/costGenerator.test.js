import { sum } from "../controllers/costGenerator.js";

test("should add two numbers", () => {
  expect(sum(1, 2)).toBe(3);
});

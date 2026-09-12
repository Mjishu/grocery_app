import { describe, expect, it } from "vitest";
import { recipes } from "./recipes";

describe("frontend recipe catalog", () => {
  it("provides at least ten complete recipes for the POC journeys", () => {
    expect(recipes.length).toBeGreaterThanOrEqual(10);
    recipes.forEach((recipe) => {
      expect(recipe.ingredients.length).toBeGreaterThanOrEqual(3);
      expect(recipe.steps.length).toBeGreaterThanOrEqual(3);
      expect(recipe.nutrition.protein).toBeGreaterThan(0);
      recipe.ingredients.forEach((ingredient) => expect(ingredient.metricAmount).not.toBe(""));
    });
  });
});

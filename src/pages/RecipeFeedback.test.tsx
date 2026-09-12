import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { RecipePage } from "./RecipePage";
import { ReportPage } from "./ReportPage";

function renderRecipe() {
  render(<MemoryRouter initialEntries={["/recipes/taco-bowls"]}><Routes><Route path="/recipes/:recipeId" element={<RecipePage cartIds={[]} onAdd={() => undefined} />} /></Routes></MemoryRouter>);
}

describe("recipe feedback", () => {
  beforeEach(() => localStorage.clear());

  it("records that a recipe was cooked and rated", async () => {
    const user = userEvent.setup();
    renderRecipe();

    await user.click(screen.getByRole("button", { name: "Mark as cooked" }));
    await user.click(screen.getByRole("button", { name: "Rate 5 stars" }));

    expect(screen.getByText("Thanks for rating this recipe.")).toBeVisible();
    expect(localStorage.getItem("grocery-feedback")).toContain('"rating":5');
  });

  it("lets anyone record a factual or safety concern locally", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/report/taco-bowls"]}><Routes><Route path="/report/:recipeId" element={<ReportPage />} /></Routes></MemoryRouter>);

    await user.selectOptions(screen.getByLabelText("Concern type"), "safety");
    await user.type(screen.getByLabelText("What happened?"), "The chicken timing seems too short.");
    await user.click(screen.getByRole("button", { name: "Submit report" }));

    expect(screen.getByText("Report saved on this device.")).toBeVisible();
    expect(localStorage.getItem("grocery-reports")).toContain("chicken timing");
  });
});

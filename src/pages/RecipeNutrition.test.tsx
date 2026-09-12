import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { RecipePage } from "./RecipePage";

describe("recipe nutrition and measurements", () => {
  it("shows estimated macros and switches reviewed ingredient amounts to metric", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/recipes/taco-bowls"]}><Routes><Route path="recipes/:recipeId" element={<RecipePage cartIds={[]} onAdd={vi.fn()} />} /></Routes></MemoryRouter>);

    expect(screen.getByText("46 g protein")).toBeVisible();
    expect(screen.getByText("USDA-derived estimates")).toBeVisible();
    expect(screen.getByText("1 lb")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Metric" }));

    expect(screen.getByText("454 g")).toBeVisible();
    expect(screen.queryByText("1 lb")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Decrease servings" }));
    expect(screen.getByText("341 g")).toBeVisible();
  });
});

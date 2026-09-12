import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

function renderApp(path = "/") {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
}

describe("appearance", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("starts in dark mode when there is no saved choice", async () => {
    renderApp();

    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-theme", "dark"));
    expect(screen.getByRole("button", { name: "Switch to bright mode" })).toBeVisible();
  });

  it("respects a saved bright choice and persists a change back to dark", async () => {
    localStorage.setItem("grocery-theme", "bright");
    const user = userEvent.setup();
    renderApp();

    const toggle = screen.getByRole("button", { name: "Switch to dark mode" });
    await user.click(toggle);

    await waitFor(() => expect(localStorage.getItem("grocery-theme")).toBe("dark"));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});

describe("active grocery plan", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("grocery-profile", JSON.stringify({ dietaryAcknowledged: true, allergens: [] }));
  });

  it("restores recipes after the app is reopened", async () => {
    const user = userEvent.setup();
    const firstSession = renderApp();

    await user.click(screen.getByRole("button", { name: "Add Smoky taco bowls" }));
    expect(localStorage.getItem("grocery-cart")).toContain("taco-bowls");

    firstSession.unmount();
    renderApp("/groceries");
    expect(screen.getByText("Smoky taco bowls")).toBeVisible();
    expect(screen.getByText("2,053 cal")).toBeVisible();
  });

  it("remembers an item the user usually has in the pantry", async () => {
    localStorage.setItem("grocery-cart", JSON.stringify([{ recipeId: "taco-bowls", servings: 4 }]));
    const user = userEvent.setup();
    renderApp("/groceries");

    await user.click(screen.getByRole("button", { name: "I usually have Avocado" }));

    expect(screen.queryByText("Avocado")).not.toBeInTheDocument();
    expect(localStorage.getItem("grocery-pantry")).toContain("avocado");
    expect(screen.getByText("1 pantry item hidden")).toBeVisible();
  });
});

describe("dietary safety gate", () => {
  beforeEach(() => localStorage.clear());

  it("preserves the attempted recipe add until dietary restrictions are acknowledged", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "Add Smoky taco bowls" }));
    expect(screen.getByRole("dialog", { name: "Before you add your first recipe" })).toBeVisible();
    expect(screen.getByLabelText("None known")).not.toBeChecked();

    await user.click(screen.getByLabelText("None known"));
    await user.click(screen.getByRole("button", { name: "Save and add recipe" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Grocery plan with 1 recipes" })).toBeVisible();
    expect(localStorage.getItem("grocery-profile")).toContain("dietaryAcknowledged");
  });
});

describe("profile preferences", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("grocery-profile", JSON.stringify({ dietaryAcknowledged: true, allergens: [], servings: 4, equipment: [] }));
  });

  it("lets the user edit and persist cooking preferences", async () => {
    const user = userEvent.setup();
    renderApp("/profile");

    await user.clear(screen.getByLabelText("Default servings"));
    await user.type(screen.getByLabelText("Default servings"), "2");
    await user.click(screen.getByLabelText("Air fryer"));
    await user.selectOptions(screen.getByLabelText("Maximum cooking time"), "30");
    await user.click(screen.getByRole("button", { name: "Save preferences" }));

    expect(screen.getByText("Preferences saved")).toBeVisible();
    expect(localStorage.getItem("grocery-profile")).toContain("Air fryer");
    expect(localStorage.getItem("grocery-profile")).toContain('"servings":2');
  });
});

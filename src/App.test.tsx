import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

  it("uses the saved default serving count for newly added recipes", async () => {
    localStorage.setItem("grocery-profile", JSON.stringify({ dietaryAcknowledged: true, allergens: [], servings: 2 }));
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "Add Smoky taco bowls" }));

    expect(localStorage.getItem("grocery-cart")).toContain('"servings":2');
  });

  it("archives and clears the active plan only after confirmation", async () => {
    localStorage.setItem("grocery-cart", JSON.stringify([{ recipeId: "taco-bowls", servings: 4 }]));
    const user = userEvent.setup();
    renderApp("/groceries");

    await user.click(screen.getByRole("button", { name: "Archive and clear plan" }));
    expect(screen.getByRole("dialog", { name: "Clear this grocery plan?" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Archive and clear" }));

    expect(screen.getByText("Your basket is ready for ideas.")).toBeVisible();
    expect(localStorage.getItem("grocery-cart-archive")).toContain("taco-bowls");
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
    await user.click(screen.getByLabelText("Milk"));
    await user.selectOptions(screen.getByLabelText("Maximum cooking time"), "30");
    await user.click(screen.getByRole("button", { name: "Save preferences" }));

    expect(screen.getByText("Preferences saved")).toBeVisible();
    expect(localStorage.getItem("grocery-profile")).toContain("Air fryer");
    expect(localStorage.getItem("grocery-profile")).toContain("Milk");
    expect(localStorage.getItem("grocery-profile")).toContain('"servings":2');
  });

  it("shows recipes saved on this device", () => {
    localStorage.setItem("grocery-saved-recipes", JSON.stringify(["lemon-pasta"]));
    renderApp("/profile");

    expect(screen.getByRole("heading", { name: "Saved recipes" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Bright lemon pasta" })).toHaveAttribute("href", "/recipes/lemon-pasta");
  });
});

describe("grocery sharing", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("grocery-profile", JSON.stringify({ dietaryAcknowledged: true, allergens: [] }));
    localStorage.setItem("grocery-cart", JSON.stringify([{ recipeId: "taco-bowls", servings: 4 }]));
  });

  it("copies a categorized grocery list without exposing recipe details", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    renderApp("/groceries");

    await user.click(screen.getByRole("button", { name: "Share list" }));
    await user.click(screen.getByRole("button", { name: "Copy grocery list" }));

    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain("Produce");
    expect(writeText.mock.calls[0][0]).toContain("Avocado — 1");
    expect(screen.getByText("List copied")).toBeVisible();
  });

  it("keeps the generic list usable while store lookup awaits the backend", async () => {
    const user = userEvent.setup();
    renderApp("/groceries");

    await user.click(screen.getByRole("button", { name: "Choose a store" }));
    await user.type(screen.getByLabelText("ZIP code"), "123");
    await user.click(screen.getByRole("button", { name: "Check ZIP" }));
    expect(screen.getByText("Enter a 5-digit ZIP code.")).toBeVisible();

    await user.clear(screen.getByLabelText("ZIP code"));
    await user.type(screen.getByLabelText("ZIP code"), "10001");
    await user.click(screen.getByRole("button", { name: "Check ZIP" }));
    await user.click(screen.getByRole("button", { name: "Save ZIP" }));

    expect(localStorage.getItem("grocery-store-zip")).toBe("10001");
    expect(screen.getByText("Your categorized list still works while retailer availability is being connected.")).toBeVisible();
  });
});

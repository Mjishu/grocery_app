import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { DiscoverPage } from "./DiscoverPage";

function renderPage() {
  render(<MemoryRouter><DiscoverPage cartIds={[]} onAdd={vi.fn()} /></MemoryRouter>);
}

describe("recipe discovery", () => {
  it("filters the visible recipes from a plain-language search", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("textbox", { name: "Search recipes" }), "lemon");

    expect(screen.getByRole("heading", { name: "Bright lemon pasta" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Smoky taco bowls" })).not.toBeInTheDocument();
  });

  it("applies and clears a quick filter", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Vegetarian" }));
    expect(screen.getByRole("heading", { name: "Bright lemon pasta" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Honey salmon tray" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByRole("heading", { name: "Honey salmon tray" })).toBeVisible();
  });

  it("enforces known allergen exclusions without silently relaxing them", () => {
    render(<MemoryRouter><DiscoverPage cartIds={[]} allergens={["Milk"]} onAdd={vi.fn()} /></MemoryRouter>);

    expect(screen.queryByRole("heading", { name: "Bright lemon pasta" })).not.toBeInTheDocument();
    expect(screen.getByText(/recipes hidden for your Milk preference/)).toBeVisible();
  });
});

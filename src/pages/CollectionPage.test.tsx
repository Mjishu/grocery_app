import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { CollectionPage } from "./CollectionPage";

describe("editorial collection", () => {
  it("presents a crawlable beginner collection with working recipe links", () => {
    render(<MemoryRouter><CollectionPage cartIds={[]} onAdd={vi.fn()} /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Beginner dinners under 30 minutes" })).toBeVisible();
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /Smoky taco bowls/ })[0]).toHaveAttribute("href", "/recipes/taco-bowls");
  });
});

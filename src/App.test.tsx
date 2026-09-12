import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

function renderApp() {
  return render(<MemoryRouter><App /></MemoryRouter>);
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

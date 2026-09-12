import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { CookPage } from "./CookPage";

function renderCookingMode() {
  render(
    <MemoryRouter initialEntries={["/cook/taco-bowls"]}>
      <Routes><Route path="/cook/:recipeId" element={<CookPage />} /></Routes>
    </MemoryRouter>,
  );
}

describe("guided cooking mode", () => {
  it("lets the cook create, control, extend, reset, and dismiss a labeled timer", async () => {
    const user = userEvent.setup();
    renderCookingMode();

    await user.click(screen.getByRole("button", { name: "Add timer" }));
    expect(screen.getByText("Timer 1")).toBeVisible();
    expect(screen.getByText("05:00")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Start Timer 1" }));
    expect(screen.getByRole("button", { name: "Pause Timer 1" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Add one minute to Timer 1" }));
    expect(screen.getByText("06:00")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Reset Timer 1" }));
    expect(screen.getByText("05:00")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Dismiss Timer 1" }));
    expect(screen.queryByText("Timer 1")).not.toBeInTheDocument();
  });

  it("reads the current step aloud and warns about background timers", async () => {
    const speak = vi.fn();
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { speak, cancel: vi.fn() } });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: class { constructor(public text: string) {} } });
    const user = userEvent.setup();
    renderCookingMode();

    await user.click(screen.getByRole("button", { name: "Read step aloud" }));

    expect(speak).toHaveBeenCalledOnce();
    expect(screen.getByText(/set a device timer before leaving this page/i)).toBeVisible();
  });

  it("lets the cook opt in to keeping the screen awake", async () => {
    const release = vi.fn().mockResolvedValue(undefined);
    const request = vi.fn().mockResolvedValue({ release });
    Object.defineProperty(navigator, "wakeLock", { configurable: true, value: { request } });
    const user = userEvent.setup();
    renderCookingMode();

    await user.click(screen.getByRole("button", { name: "Keep screen awake" }));
    expect(request).toHaveBeenCalledWith("screen");
    expect(await screen.findByRole("button", { name: "Allow screen to sleep" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Allow screen to sleep" }));
    expect(release).toHaveBeenCalledOnce();
  });
});

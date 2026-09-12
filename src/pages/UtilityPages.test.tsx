import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";

describe("support and missing routes", () => {
  beforeEach(() => localStorage.clear());

  it("captures a support request locally for the frontend POC", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/support"]}><App /></MemoryRouter>);

    await user.selectOptions(screen.getByLabelText("Category"), "safety");
    await user.type(screen.getByLabelText("How can we help?"), "The oven step needs clarification.");
    await user.click(screen.getByRole("button", { name: "Save support request" }));

    expect(screen.getByRole("status")).toHaveTextContent("saved on this device");
    expect(localStorage.getItem("grocery-support-requests")).toContain("oven step");
  });

  it("shows a real not-found page for unknown client routes", () => {
    render(<MemoryRouter initialEntries={["/not-a-real-page"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "That page wandered off." })).toBeVisible();
    expect(screen.getByRole("link", { name: "Back to discovery" })).toHaveAttribute("href", "/");
  });
});

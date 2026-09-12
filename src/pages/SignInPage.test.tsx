import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { SignInPage } from "./SignInPage";

describe("frontend account entry", () => {
  it("keeps authentication choices behind an 18-plus month and year check", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignInPage /></MemoryRouter>);

    await user.selectOptions(screen.getByLabelText("Birth month"), "1");
    await user.type(screen.getByLabelText("Birth year"), "2010");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText("You must be 18 or older to create an account during the POC.")).toBeVisible();

    await user.clear(screen.getByLabelText("Birth year"));
    await user.type(screen.getByLabelText("Birth year"), "2000");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Email me a sign-in link" })).toBeVisible();
    expect(screen.getByText(/connection will be added with the backend/i)).toBeVisible();
  });
});

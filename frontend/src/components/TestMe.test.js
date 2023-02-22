import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TestMe from "./TestMe";
import { describe, it, expect } from "@jest/globals"

describe("TestMe component", () => {
  it("on the button press, the text changes", async () => {
    render(<TestMe />);
    expect(screen.getByRole('paragraph')).toHaveTextContent("text");
    await userEvent.click(screen.getByText("Click me"));
    expect(screen.getByRole('paragraph')).toHaveTextContent("Changed text");
  })
})

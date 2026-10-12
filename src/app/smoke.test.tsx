import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Home from "./page";

describe("Home page shell", () => {
  test("renders a main landmark and the top anchor", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(document.getElementById("top")).not.toBeNull();
  });
});

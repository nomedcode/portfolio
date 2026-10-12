import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { credlyBadge } from "@/lib/content";
import { Certificates } from "./Certificates";

describe("Certificates", () => {
  test("uses the section label as the only section heading", () => {
    render(<Certificates />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Certificates" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Certificates" })).toHaveClass(
      "text-4xl",
      "md:text-5xl"
    );
    expect(
      screen.queryByRole("heading", { name: "Sertifikasi" })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Selalu belajar.")).not.toBeInTheDocument();
  });

  test("shows the official Credly badge image instead of the old card grid", () => {
    const { container } = render(<Certificates />);
    const img = screen.getByRole("img", { name: credlyBadge.name });
    expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain(
      credlyBadge.image
    );
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(container.querySelectorAll("article")).toHaveLength(0);
  });

  test("links the badge to its public verification page", () => {
    render(<Certificates />);
    expect(screen.getByRole("link")).toHaveAttribute("href", credlyBadge.url);
  });

  test("names the credential and links out with a View Credential action", () => {
    render(<Certificates />);
    expect(screen.getByText(credlyBadge.name)).toBeInTheDocument();
    expect(screen.queryByText(/^Issuer:/)).not.toBeInTheDocument();
    expect(screen.getByText("View Credential")).toBeInTheDocument();
  });

  test("announces that the credential opens in a new tab", () => {
    render(<Certificates />);
    expect(screen.getByRole("link")).toHaveAccessibleName(/opens in new tab/);
  });

  test("lists the certificate's core Google Cloud skills", () => {
    render(<Certificates />);
    for (const s of credlyBadge.skills) {
      expect(screen.getByText(s)).toBeInTheDocument();
    }
  });

  test("presents the badge on a theme-aware raised card", () => {
    const { container } = render(<Certificates />);
    expect(container.querySelector("a")).toHaveClass("bg-raised", "border-line");
  });

  test("the credential link focuses with the shared ring, not a one-off accent outline", () => {
    render(<Certificates />);
    expect(screen.getByRole("link").className).not.toContain("outline-accent");
  });});

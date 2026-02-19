/**
 * Example test — PricingCards component
 * Pattern to follow for component tests.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PricingCards } from "@/components/pricing-cards";

// Mock CREDIT_PACKAGES so tests don't depend on real config values
vi.mock("@/config/credits", () => ({
  CREDIT_PACKAGES: [
    { id: "starter", credits: 10, price: 5 },
    { id: "pro", credits: 50, price: 20 },
    { id: "business", credits: 100, price: 35 },
  ],
}));

describe("PricingCards", () => {
  it("renders the three packages", () => {
    render(<PricingCards />);
    expect(screen.getByText("10 credits")).toBeInTheDocument();
    expect(screen.getByText("50 credits")).toBeInTheDocument();
    expect(screen.getByText("100 credits")).toBeInTheDocument();
  });

  it("shows the popular badge on the middle package", () => {
    render(<PricingCards />);
    expect(screen.getByText("Populaire")).toBeInTheDocument();
  });

  it("calls onPurchase with the correct package id", async () => {
    const user = userEvent.setup();
    const onPurchase = vi.fn().mockResolvedValue(undefined);
    render(<PricingCards onPurchase={onPurchase} />);

    const buttons = screen.getAllByRole("button", { name: /acheter/i });
    await user.click(buttons[0]);

    expect(onPurchase).toHaveBeenCalledWith("starter");
  });

  it("hides header when showHeader is false", () => {
    render(<PricingCards showHeader={false} />);
    expect(screen.queryByText(/Des credits pour/i)).not.toBeInTheDocument();
  });
});

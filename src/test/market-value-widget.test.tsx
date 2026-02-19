/**
 * Tests — MarketValueWidget component
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Radix UI Select uses pointer capture — polyfill for jsdom
HTMLElement.prototype.hasPointerCapture = vi.fn(() => false) as typeof HTMLElement.prototype.hasPointerCapture;
HTMLElement.prototype.setPointerCapture = vi.fn() as typeof HTMLElement.prototype.setPointerCapture;
HTMLElement.prototype.releasePointerCapture = vi.fn() as typeof HTMLElement.prototype.releasePointerCapture;

vi.mock("@/lib/auth-client", () => ({
  useSession: vi.fn(),
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Replace Radix Select with native <select> so jsdom can interact with it
vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode;
    value: string;
    onValueChange: (v: string) => void;
  }) => (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      data-testid="condition-select"
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
  SelectValue: ({ placeholder }: { placeholder: string }) => <option value="">{placeholder}</option>,
}));

import { useSession } from "@/lib/auth-client";
import { MarketValueWidget } from "@/components/specification/market-value-widget";

const mockUseSession = vi.mocked(useSession);

const DEFAULT_PROPS = {
  generationId: 1234,
  makeName: "Peugeot",
  modelName: "208",
};

describe("MarketValueWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows login prompt when user is not authenticated", () => {
    mockUseSession.mockReturnValue({ data: null } as ReturnType<typeof useSession>);

    render(<MarketValueWidget {...DEFAULT_PROPS} />);
    expect(screen.getByText(/connectez-vous/i)).toBeInTheDocument();
    expect(screen.getByText(/pour estimer la valeur/i)).toBeInTheDocument();
    expect(screen.getByText(/1 crédit/i)).toBeInTheDocument();
  });

  it("shows 'Estimer la valeur' button when authenticated", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Test" } },
    } as ReturnType<typeof useSession>);

    render(<MarketValueWidget {...DEFAULT_PROPS} />);
    expect(screen.getByRole("button", { name: /estimer la valeur/i })).toBeInTheDocument();
  });

  it("shows the vehicle name in the card description", () => {
    mockUseSession.mockReturnValue({ data: null } as ReturnType<typeof useSession>);

    render(<MarketValueWidget {...DEFAULT_PROPS} />);
    expect(screen.getByText(/peugeot.*208/i)).toBeInTheDocument();
  });

  it("opens the estimation dialog when button is clicked", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Test" } },
    } as ReturnType<typeof useSession>);

    const user = userEvent.setup();
    render(<MarketValueWidget {...DEFAULT_PROPS} />);

    await user.click(screen.getByRole("button", { name: /estimer la valeur/i }));

    expect(screen.getByLabelText(/année/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kilométrage/i)).toBeInTheDocument();
  });

  it("shows credit cost indicator inside the dialog", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Test" } },
    } as ReturnType<typeof useSession>);

    const user = userEvent.setup();
    render(<MarketValueWidget {...DEFAULT_PROPS} />);

    await user.click(screen.getByRole("button", { name: /estimer la valeur/i }));

    expect(
      screen.getByText(/1 crédit sera consommé pour cette estimation/i)
    ).toBeInTheDocument();
  });

  it("estimate button is disabled when fields are empty", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Test" } },
    } as ReturnType<typeof useSession>);

    const user = userEvent.setup();
    render(<MarketValueWidget {...DEFAULT_PROPS} />);

    await user.click(screen.getByRole("button", { name: /estimer la valeur/i }));

    // The submit button inside the dialog
    const submitBtns = screen.getAllByRole("button", { name: /estimer la valeur/i });
    const dialogSubmit = submitBtns[submitBtns.length - 1];
    expect(dialogSubmit).toBeDisabled();
  });

  it("enables estimate button when all fields are filled", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Test" } },
    } as ReturnType<typeof useSession>);

    const user = userEvent.setup();
    render(<MarketValueWidget {...DEFAULT_PROPS} />);

    await user.click(screen.getByRole("button", { name: /estimer la valeur/i }));

    await user.type(screen.getByLabelText(/année/i), "2018");
    await user.type(screen.getByLabelText(/kilométrage/i), "85000");

    // Select condition via native select (mocked)
    await user.selectOptions(screen.getByTestId("condition-select"), "excellent");

    const submitBtns = screen.getAllByRole("button", { name: /estimer la valeur/i });
    const dialogSubmit = submitBtns[submitBtns.length - 1];
    expect(dialogSubmit).not.toBeDisabled();
  });

  it("displays an error message when API returns 401", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Test" } },
    } as ReturnType<typeof useSession>);

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: "Unauthorized" }),
    });

    const user = userEvent.setup();
    render(<MarketValueWidget {...DEFAULT_PROPS} />);

    await user.click(screen.getByRole("button", { name: /estimer la valeur/i }));
    await user.type(screen.getByLabelText(/année/i), "2018");
    await user.type(screen.getByLabelText(/kilométrage/i), "85000");
    await user.selectOptions(screen.getByTestId("condition-select"), "excellent");

    const submitBtns = screen.getAllByRole("button", { name: /estimer la valeur/i });
    await user.click(submitBtns[submitBtns.length - 1]);

    await vi.waitFor(() => {
      expect(
        screen.getByText(/vous devez être connecté/i)
      ).toBeInTheDocument();
    });
  });

  it("displays insufficient credits error on 402", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Test" } },
    } as ReturnType<typeof useSession>);

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 402,
      json: () => Promise.resolve({ balance: 0 }),
    });

    const user = userEvent.setup();
    render(<MarketValueWidget {...DEFAULT_PROPS} />);

    await user.click(screen.getByRole("button", { name: /estimer la valeur/i }));
    await user.type(screen.getByLabelText(/année/i), "2020");
    await user.type(screen.getByLabelText(/kilométrage/i), "30000");
    await user.selectOptions(screen.getByTestId("condition-select"), "excellent");

    const submitBtns = screen.getAllByRole("button", { name: /estimer la valeur/i });
    await user.click(submitBtns[submitBtns.length - 1]);

    await vi.waitFor(() => {
      expect(screen.getByText(/crédits insuffisants/i)).toBeInTheDocument();
    });
  });
});

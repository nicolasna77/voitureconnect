/**
 * Tests — SearchWithFilters component
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ data: undefined, isLoading: false }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("axios", () => ({
  default: { get: vi.fn().mockResolvedValue({ data: { data: [] } }) },
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

vi.mock("@/components/specification/specification-filter", () => ({
  default: () => <div data-testid="spec-filter" />,
}));

vi.mock("@/hooks/use-debounce", () => ({
  useDebounce: (val: string) => val,
}));

import { SearchWithFilters } from "@/components/specification/search-with-filters";

const RECENT_KEY = "dm_recent_searches";

describe("SearchWithFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1280,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ── Render ──────────────────────────────────────────────────────────────────

  it("renders the search form", () => {
    render(<SearchWithFilters />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("renders the search input with correct aria-label", () => {
    render(<SearchWithFilters />);
    expect(
      screen.getByLabelText(/rechercher des fiches techniques/i)
    ).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<SearchWithFilters />);
    expect(screen.getByRole("button", { name: /rechercher/i })).toBeInTheDocument();
  });

  it("renders the filters button", () => {
    render(<SearchWithFilters />);
    expect(
      screen.getByRole("button", { name: /filtres de recherche/i })
    ).toBeInTheDocument();
  });

  it("shows the / kbd badge hint on desktop when input is empty and unfocused", () => {
    render(<SearchWithFilters />);
    expect(screen.getByText("/")).toBeInTheDocument();
  });

  // ── Recent searches ─────────────────────────────────────────────────────────

  it("loads recent searches from localStorage on mount without crashing", () => {
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(["BMW Série 3", "Renault Clio"])
    );
    render(<SearchWithFilters />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("shows recent searches section when focusing empty input with stored searches", async () => {
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(["BMW Série 3", "Renault Clio"])
    );
    const user = userEvent.setup();
    render(<SearchWithFilters />);

    await act(async () => {
      await user.click(screen.getByLabelText(/rechercher des fiches techniques/i));
    });

    await waitFor(() => {
      expect(screen.getByText("Recherches récentes")).toBeInTheDocument();
    });

    expect(screen.getByText("BMW Série 3")).toBeInTheDocument();
    expect(screen.getByText("Renault Clio")).toBeInTheDocument();
  });

  it("does not show recent searches section when localStorage is empty", async () => {
    const user = userEvent.setup();
    render(<SearchWithFilters />);

    await user.click(screen.getByLabelText(/rechercher des fiches techniques/i));

    expect(screen.queryByText("Recherches récentes")).not.toBeInTheDocument();
  });

  it("removes a specific recent search when its remove button is clicked", async () => {
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(["BMW Série 3", "Renault Clio"])
    );
    const user = userEvent.setup();
    render(<SearchWithFilters />);

    await act(async () => {
      await user.click(screen.getByLabelText(/rechercher des fiches techniques/i));
    });

    await waitFor(() => {
      expect(screen.getByText("BMW Série 3")).toBeInTheDocument();
    });

    const removeBtn = screen.getByRole("button", {
      name: /retirer "BMW Série 3" des recherches récentes/i,
    });
    await user.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByText("BMW Série 3")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Renault Clio")).toBeInTheDocument();

    const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    expect(stored).not.toContain("BMW Série 3");
    expect(stored).toContain("Renault Clio");
  });

  it("clears all recent searches when 'Effacer tout' is clicked", async () => {
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(["BMW Série 3", "Renault Clio"])
    );
    const user = userEvent.setup();
    render(<SearchWithFilters />);

    await act(async () => {
      await user.click(screen.getByLabelText(/rechercher des fiches techniques/i));
    });

    await waitFor(() => {
      expect(screen.getByText("Effacer tout")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Effacer tout"));

    await waitFor(() => {
      expect(screen.queryByText("Recherches récentes")).not.toBeInTheDocument();
    });
    expect(localStorage.getItem(RECENT_KEY)).toBeNull();
  });

  // ── Keyboard shortcut ────────────────────────────────────────────────────────

  it("focuses the search input when / is pressed on desktop (nothing focused)", () => {
    render(<SearchWithFilters />);
    const input = screen.getByLabelText(/rechercher des fiches techniques/i);

    fireEvent.keyDown(document, { key: "/" });

    expect(document.activeElement).toBe(input);
  });

  it("does not focus input when / is pressed on mobile (width < 768)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<SearchWithFilters />);
    const input = screen.getByLabelText(/rechercher des fiches techniques/i);

    fireEvent.keyDown(document, { key: "/" });

    expect(document.activeElement).not.toBe(input);
  });

  it("does not steal focus when / is pressed while another input is active", () => {
    render(
      <>
        <input data-testid="other-input" />
        <SearchWithFilters />
      </>
    );

    const otherInput = screen.getByTestId("other-input");
    const searchInput = screen.getByLabelText(/rechercher des fiches techniques/i);

    otherInput.focus();
    fireEvent.keyDown(document, { key: "/" });

    expect(document.activeElement).not.toBe(searchInput);
    expect(document.activeElement).toBe(otherInput);
  });

  // ── Keyboard navigation ──────────────────────────────────────────────────────

  it("closes the dropdown when Escape is pressed", async () => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(["BMW Série 3"]));
    const user = userEvent.setup();
    render(<SearchWithFilters />);

    const input = screen.getByLabelText(/rechercher des fiches techniques/i);

    await act(async () => {
      await user.click(input);
    });

    await waitFor(() => {
      expect(screen.getByText("Recherches récentes")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByText("Recherches récentes")).not.toBeInTheDocument();
    });
  });
});

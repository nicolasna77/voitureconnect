/**
 * Tests — ReferralPage component
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockInvalidateQueries = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

vi.mock("axios", () => {
  const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    isAxiosError: vi.fn().mockReturnValue(false),
  };
  return { default: mockAxios, isAxiosError: mockAxios.isAxiosError };
});

vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

import { useQuery, useMutation } from "@tanstack/react-query";
import ReferralPage from "@/app/[locale]/(main)/(content)/setting/referral/page";

const mockUseQuery = vi.mocked(useQuery);
const mockUseMutation = vi.mocked(useMutation);

const MOCK_DATA = {
  id: "ref-code-1",
  code: "ABC123",
  usedCount: 2,
  createdAt: "2026-01-01T00:00:00.000Z",
  referrals: [
    {
      id: "ref1",
      referredUserId: "user2",
      rewardGiven: true,
      createdAt: "2026-01-15T00:00:00.000Z",
      referredUser: {
        id: "user2",
        name: "Jean Dupont",
        createdAt: "2026-01-15T00:00:00.000Z",
      },
    },
  ],
};

describe("ReferralPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useMutation>);
  });

  it("shows loading skeletons while data is loading", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useQuery>);

    const { container } = render(<ReferralPage />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders the referral code when loaded", () => {
    mockUseQuery.mockReturnValue({
      data: MOCK_DATA,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<ReferralPage />);
    expect(screen.getByText("ABC123")).toBeInTheDocument();
  });

  it("shows the used count badge", () => {
    mockUseQuery.mockReturnValue({
      data: MOCK_DATA,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<ReferralPage />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("displays the referrals list when referrals exist", () => {
    mockUseQuery.mockReturnValue({
      data: MOCK_DATA,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<ReferralPage />);
    expect(screen.getByText("Mes filleuls")).toBeInTheDocument();
    expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
  });

  it("shows apply code input form", () => {
    mockUseQuery.mockReturnValue({
      data: MOCK_DATA,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<ReferralPage />);
    expect(screen.getByPlaceholderText("ex: ABC123")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /appliquer/i })).toBeInTheDocument();
  });

  it("apply button is disabled when input is too short", () => {
    mockUseQuery.mockReturnValue({
      data: MOCK_DATA,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<ReferralPage />);
    const applyBtn = screen.getByRole("button", { name: /appliquer/i });
    expect(applyBtn).toBeDisabled();
  });

  it("apply button enables when input has 4+ characters", async () => {
    mockUseQuery.mockReturnValue({
      data: MOCK_DATA,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    const user = userEvent.setup();
    render(<ReferralPage />);

    const input = screen.getByPlaceholderText("ex: ABC123");
    await user.type(input, "ABCD");

    const applyBtn = screen.getByRole("button", { name: /appliquer/i });
    expect(applyBtn).not.toBeDisabled();
  });

  it("shows the copy and share buttons", () => {
    mockUseQuery.mockReturnValue({
      data: MOCK_DATA,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<ReferralPage />);
    expect(screen.getByRole("button", { name: /copier le code/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /partager/i })).toBeInTheDocument();
  });
});

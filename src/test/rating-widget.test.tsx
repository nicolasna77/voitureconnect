/**
 * Tests — RatingWidget component
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

vi.mock("@/lib/auth-client", () => ({
  useSession: vi.fn(),
}));

vi.mock("axios", () => {
  const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    isAxiosError: vi.fn().mockReturnValue(false),
  };
  return { default: mockAxios, isAxiosError: mockAxios.isAxiosError };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { RatingWidget } from "@/components/specification/rating-widget";

const mockUseQuery = vi.mocked(useQuery);
const mockUseMutation = vi.mocked(useMutation);
const mockUseSession = vi.mocked(useSession);

const MOCK_EMPTY_RATINGS = {
  ratings: [],
  average: 0,
  count: 0,
  distribution: [
    { star: 1, count: 0 },
    { star: 2, count: 0 },
    { star: 3, count: 0 },
    { star: 4, count: 0 },
    { star: 5, count: 0 },
  ],
  userRating: null,
};

const MOCK_RATINGS_WITH_DATA = {
  ratings: [
    {
      id: "r1",
      userId: "other-user",
      generationId: 1234,
      trimId: null,
      stars: 4,
      title: "Très bien",
      comment: "Voiture fiable et économique.",
      createdAt: "2026-01-10T00:00:00.000Z",
      user: { id: "other-user", name: "Marie Martin", picture: "" },
    },
  ],
  average: 4.0,
  count: 1,
  distribution: [
    { star: 1, count: 0 },
    { star: 2, count: 0 },
    { star: 3, count: 0 },
    { star: 4, count: 1 },
    { star: 5, count: 0 },
  ],
  userRating: null,
};

const MOCK_USER_RATING = {
  id: "ur1",
  userId: "me",
  generationId: 1234,
  trimId: null,
  stars: 5,
  title: "Excellent",
  comment: "Je recommande.",
  createdAt: "2026-01-20T00:00:00.000Z",
  user: { id: "me", name: "Moi", picture: "" },
};

describe("RatingWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useMutation>);
  });

  it("shows loading skeleton while data is loading", () => {
    mockUseSession.mockReturnValue({ data: null } as ReturnType<typeof useSession>);
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useQuery>);

    const { container } = render(<RatingWidget generationId={1234} />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("shows login prompt when user is not authenticated", () => {
    mockUseSession.mockReturnValue({ data: null } as ReturnType<typeof useSession>);
    mockUseQuery.mockReturnValue({
      data: MOCK_EMPTY_RATINGS,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<RatingWidget generationId={1234} />);
    expect(screen.getByText(/connectez-vous/i)).toBeInTheDocument();
    expect(screen.getByText(/pour laisser un avis/i)).toBeInTheDocument();
  });

  it("shows 'Laisser un avis' button when authenticated with no rating", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Test" } },
    } as ReturnType<typeof useSession>);
    mockUseQuery.mockReturnValue({
      data: MOCK_EMPTY_RATINGS,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<RatingWidget generationId={1234} />);
    expect(screen.getByRole("button", { name: /laisser un avis/i })).toBeInTheDocument();
  });

  it("opens the rating form when 'Laisser un avis' is clicked", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Test" } },
    } as ReturnType<typeof useSession>);
    mockUseQuery.mockReturnValue({
      data: MOCK_EMPTY_RATINGS,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    const user = userEvent.setup();
    render(<RatingWidget generationId={1234} />);

    await user.click(screen.getByRole("button", { name: /laisser un avis/i }));

    expect(screen.getByRole("group", { name: /sélectionner une note/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /publier/i })).toBeInTheDocument();
  });

  it("submit button is disabled when no star is selected", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Test" } },
    } as ReturnType<typeof useSession>);
    mockUseQuery.mockReturnValue({
      data: MOCK_EMPTY_RATINGS,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    const user = userEvent.setup();
    render(<RatingWidget generationId={1234} />);

    await user.click(screen.getByRole("button", { name: /laisser un avis/i }));

    expect(screen.getByRole("button", { name: /publier/i })).toBeDisabled();
  });

  it("enables publish button after a star is selected", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Test" } },
    } as ReturnType<typeof useSession>);
    mockUseQuery.mockReturnValue({
      data: MOCK_EMPTY_RATINGS,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    const user = userEvent.setup();
    render(<RatingWidget generationId={1234} />);

    await user.click(screen.getByRole("button", { name: /laisser un avis/i }));
    await user.click(screen.getByRole("button", { name: /3 étoiles/i }));

    expect(screen.getByRole("button", { name: /publier/i })).not.toBeDisabled();
  });

  it("shows existing user rating with Modifier and Supprimer buttons", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Moi" } },
    } as ReturnType<typeof useSession>);
    mockUseQuery.mockReturnValue({
      data: { ...MOCK_RATINGS_WITH_DATA, userRating: MOCK_USER_RATING },
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<RatingWidget generationId={1234} />);
    expect(screen.getByText("Mon avis")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /modifier/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /supprimer/i })).toBeInTheDocument();
  });

  it("shows average and review count", () => {
    mockUseSession.mockReturnValue({ data: null } as ReturnType<typeof useSession>);
    mockUseQuery.mockReturnValue({
      data: MOCK_RATINGS_WITH_DATA,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<RatingWidget generationId={1234} />);
    expect(screen.getByText("4.0")).toBeInTheDocument();
    expect(screen.getByText("1 avis")).toBeInTheDocument();
  });

  it("displays other users' recent reviews", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "me", name: "Moi" } },
    } as ReturnType<typeof useSession>);
    mockUseQuery.mockReturnValue({
      data: MOCK_RATINGS_WITH_DATA,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<RatingWidget generationId={1234} />);
    expect(screen.getByText("Avis récents")).toBeInTheDocument();
    expect(screen.getByText(/marie martin/i)).toBeInTheDocument();
    expect(screen.getByText("Très bien")).toBeInTheDocument();
  });
});

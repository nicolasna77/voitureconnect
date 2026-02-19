/**
 * Tests — RegisterForm referral code field
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/lib/auth-client", () => ({
  signUp: {
    email: vi.fn().mockResolvedValue({ error: null }),
  },
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// next/dynamic returns the lazy component — mock it to return a no-op component
vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

import RegisterForm from "@/components/auth/register-form";

describe("RegisterForm — referral code field", () => {
  it("renders the referral code input field", () => {
    render(<RegisterForm />);
    expect(
      screen.getByLabelText(/code de parrainage/i)
    ).toBeInTheDocument();
  });

  it("referral code input is not marked as required", () => {
    render(<RegisterForm />);
    const input = screen.getByLabelText(/code de parrainage/i);
    expect(input).not.toHaveAttribute("required");
  });

  it("referral code input accepts uppercase text", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const input = screen.getByLabelText(/code de parrainage/i);
    await user.type(input, "abc123");

    // The input has CSS uppercase class but we verify the raw value
    expect(input).toHaveValue("abc123");
  });

  it("referral code input has maxLength of 6", () => {
    render(<RegisterForm />);
    const input = screen.getByLabelText(/code de parrainage/i);
    expect(input).toHaveAttribute("maxlength", "6");
  });

  it("shows helper text about bonus credits", () => {
    render(<RegisterForm />);
    expect(
      screen.getByText(/3 crédits offerts/i)
    ).toBeInTheDocument();
  });

  it("calls the referral validate API after successful registration", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    global.fetch = fetchSpy;

    const { signUp } = await import("@/lib/auth-client");
    vi.mocked(signUp.email).mockResolvedValue({ error: null } as Awaited<ReturnType<typeof signUp.email>>);

    const user = userEvent.setup();
    render(<RegisterForm />);

    // Fill out required fields
    await user.type(screen.getByLabelText("username"), "TestUser");
    await user.type(screen.getByLabelText("email"), "test@example.com");
    await user.type(screen.getByLabelText("password"), "password123");
    await user.type(screen.getByLabelText(/code de parrainage/i), "XYZ789");

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await user.click(submitBtn);

    // After successful signup, referral validate should be called
    await vi.waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/referral/validate",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ code: "XYZ789" }),
        })
      );
    });
  });
});

import { AuthModal } from "@/components/auth/auth-modal";
import RegisterForm from "@/components/auth/register-form";

export default async function RegisterModal({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <AuthModal title="Inscription">
      <RegisterForm callbackUrl={callbackUrl} />
    </AuthModal>
  );
}

import { AuthModal } from "@/components/auth/auth-modal";
import LoginForm from "@/components/auth/login-form";

export default async function LoginModal({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <AuthModal title="Connexion">
      <LoginForm callbackUrl={callbackUrl} />
    </AuthModal>
  );
}

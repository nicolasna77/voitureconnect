"use client";
import { Button } from "@/components/ui/button";
import {
  AtSign,
  Key,
  User,
  Loader2,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

const LoginSocial = dynamic(() => import("./login-social"), { ssr: false });

const registerSchema = z.object({
  name: z.string().min(1, "Le nom d'utilisateur est requis"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const t = useTranslations("RegisterForm");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        setError(result.error.message || t("errors.default"));
      } else {
        toast.success(t("success.title"), {
          description: t("success.description"),
        });
        router.push("/login");
      }
    } catch {
      setError(t("errors.default"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-lg px-6 pb-4 pt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <UserPlus className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>
          Rejoignez la communauté VoitureConnect
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginSocial />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {t("or")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">{t("username")}</Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder={t("usernamePlaceholder")}
                className="pl-10"
                autoComplete="username"
                {...register("name")}
              />
              <User
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                className="pl-10"
                autoComplete="email"
                spellCheck={false}
                {...register("email")}
              />
              <AtSign
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                className="pl-10 pr-10"
                autoComplete="new-password"
                {...register("password")}
              />
              <Key
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Inscription…
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;

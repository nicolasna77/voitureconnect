"use client";
import { Button } from "../ui/button";
import { AtSign, Key, User } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import Link from "next/link";

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
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("RegisterForm");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.status === 500) {
        setError(t("errors.default"));
      }
      if (res.status === 400) {
        const errorMessage = await res.text();
        setError(errorMessage);
      }
      if (res.status === 200) {
        toast({
          title: t("success.title"),
          variant: "default",
          description: t("success.description"),
        });
        router.push("/login");
      }
    } catch (error) {
      setError(t("errors.default"));
      console.log(error);
    }
  };

  return (
    <Card className="grid gap-6 rounded-lg  px-6 pb-4 pt-8">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginSocial />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t("or")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {error && <p className="text-red-700 text-sm text-center">{error}</p>}
          <div className="w-full">
            <div className="mt-4">
              <Label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="name"
              >
                {t("username")}
              </Label>
              <div className="relative">
                <Input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="name"
                  type="text"
                  placeholder={t("usernamePlaceholder")}
                  {...register("name")}
                />
                <User className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="mt-4">
              <Label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                {t("email")}
              </Label>
              <div className="relative">
                <Input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...register("email")}
                />
                <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mt-4">
              <Label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                {t("password")}
              </Label>
              <div className="relative">
                <Input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  {...register("password")}
                />
                <Key className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="py-4">
            <Button
              size={"lg"}
              variant={"default"}
              className="m-auto justify-center flex "
              type="submit"
            >
              {t("submit")}
            </Button>
          </div>
        </form>
        <div className="text-center m-auto">
          <Link href="/login" className="text-sm text-primary ">
            Vous avez déjà un compte ?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
export default RegisterForm;

"use client";
import { Button } from "@/components/ui/button";
import { AtSign, Key, AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import LoginSocial from "./login-social";
import { useFormState, useFormStatus } from "react-dom";
import { authentication } from "@/lib/actions";

// Créer un composant pour le bouton de soumission
const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      size={"lg"}
      variant={"default"}
      className="m-auto justify-center flex"
      type="submit"
    >
      {pending ? <Loader2 className="animate-spin" /> : "Se Connecter"}
    </Button>
  );
};

const LoginForm = () => {
  const [state, formAction] = useFormState(authentication, null);

  return (
    <Card className="grid gap-6 rounded-lg px-6 pb-4 pt-8">
      <CardHeader>
        <CardTitle className="text-2xl">Connectez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginSocial />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou</span>
          </div>
        </div>

        <form action={formAction}>
          {state && (
            <div className="flex items-center gap-2 p-3 bg-red-100 rounded-md mb-4">
              <AlertTriangle className="text-red-500 h-5 w-5" />
              <p className="text-red-500 text-sm">{state}</p>
            </div>
          )}
          <div className="w-full">
            <div>
              <Label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Entrez votre email"
                  required
                />
                <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="mt-4">
              <Label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="********"
                  required
                  minLength={6}
                />
                <Key className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div>
              <Link href="/forgot-password" className="text-sm text-primary">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>
          <div className="py-4">
            <SubmitButton />
          </div>
        </form>
        <div className="text-center m-auto">
          <Link href="/register" className="text-sm text-primary ">
            Vous n&apos;avez pas de compte ?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

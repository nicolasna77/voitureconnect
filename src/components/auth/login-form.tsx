"use client";
import { Button } from "@/components/ui/button";
import { AtSign, Key, AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import LoginSocial from "./login-social";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "@/lib/actions";

const LoginForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      setLoading(true);
      await authenticate(formData);
    } catch (e) {
      setError("Vérifiez vos identifiants");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="grid gap-6 rounded-lg  px-6 pb-4 pt-8">
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

        <form onSubmit={onSubmit}>
          {error && (
            <div className="flex m-auto items-center gap-2">
              <AlertTriangle className="text-red-500" />
              <p className="text-red-500">{error}</p>
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
            <Button
              size={"lg"}
              variant={"default"}
              className="m-auto justify-center flex"
              type="submit"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Se Connecter"}
            </Button>
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

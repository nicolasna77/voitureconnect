import { Button } from "@/components/ui/button";
import { AlarmCheck, ArrowRightIcon, AtSign, Key } from "lucide-react";
import { signIn } from "../../../auth";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function LoginForm() {
  return (
    <div className="grid gap-6 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      <h1 className={` mb-3 text-2xl`}>Connectez-vous</h1>
      <div className="flex gap-4">
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button
            variant={"outline"}
            className="px-4 m-auto py-2 border flex gap-2"
            type="submit"
            size={"lg"}
          >
            <Image src="/google.svg" height={24} width={24} alt="icon google" />
            Sign in with Google
          </Button>
        </form>

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <Button
            variant={"outline"}
            className="px-4 m-auto py-2 border flex gap-2"
            type="submit"
            size={"lg"}
          >
            <GitHubLogoIcon width={24} height={24} />
            Sign in with GitHub
          </Button>
        </form>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou</span>
        </div>
      </div>

      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", formData, {
            redirectTo: "/dashboard",
          });
        }}
        className="space-y-3"
      >
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
            className="m-auto justify-center flex "
          >
            Se connecter
          </Button>
        </div>
      </form>
      <div className="text-center m-auto">
        <Link href="/register" className="text-sm text-primary ">
          Vous avez pas de compte ?
        </Link>
      </div>
    </div>
  );
}

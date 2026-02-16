import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  AlertTriangle,
  Coins,
  Gauge,
  Loader2,
  Lock,
  Unlock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AccessGateProps {
  locale: "fr" | "en";
  title: string;
}

export function AccessGateLoading({ title }: { title: string }) {
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4" aria-hidden="true" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-4" role="status">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </CardContent>
    </Card>
  );
}

export function AccessGateError({ locale, title }: AccessGateProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4" aria-hidden="true" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <AlertTriangle className="w-8 h-8 mx-auto text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          {locale === "fr"
            ? "Service temporairement indisponible"
            : "Service temporarily unavailable"}
        </p>
      </CardContent>
    </Card>
  );
}

export function AccessGateLogin({ locale, title }: AccessGateProps) {
  const tCredits = useTranslations("Credits");

  return (
    <Card className="sticky top-4 border-2 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4" aria-hidden="true" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <Lock className="w-10 h-10 mx-auto text-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          {locale === "fr"
            ? "Connectez-vous pour acceder a l'analyse IA"
            : "Login to access AI analysis"}
        </p>
        <Button size="sm" className="w-full" asChild>
          <Link href="/login">
            {tCredits("login")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function AccessGateUnlock({
  locale,
  title,
  creditBalance,
  creditCost,
  isConsuming,
  onUnlock,
}: AccessGateProps & {
  creditBalance: number;
  creditCost: number;
  isConsuming: boolean;
  onUnlock: () => void;
}) {
  const tCredits = useTranslations("Credits");
  const canUnlock = creditBalance >= creditCost;

  return (
    <Card className="sticky top-4 border-2 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4" aria-hidden="true" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Lock
            className="w-10 h-10 mx-auto text-primary mb-2"
            aria-hidden="true"
          />
          <p className="text-sm font-medium">
            {locale === "fr"
              ? "Debloquer l'analyse IA"
              : "Unlock AI Analysis"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {locale === "fr"
              ? "Obtenez un rapport detaille sur la fiabilite de ce vehicule"
              : "Get a detailed reliability report for this vehicle"}
          </p>
        </div>

        <div className="flex items-center justify-between p-3 bg-background rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <Coins
              className="w-4 h-4 text-yellow-500"
              aria-hidden="true"
            />
            <span>{tCredits("yourBalance")}</span>
          </div>
          <span className="font-bold tabular-nums">
            {creditBalance} {tCredits("credits")}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-background rounded-lg text-sm">
          <span>{tCredits("cost")}</span>
          <span className="font-bold tabular-nums">
            {creditCost} {tCredits("credit")}
          </span>
        </div>

        {canUnlock ? (
          <Button
            className="w-full"
            size="sm"
            onClick={onUnlock}
            disabled={isConsuming}
          >
            {isConsuming ? (
              <Loader2
                className="w-4 h-4 mr-2 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Unlock className="w-4 h-4 mr-2" aria-hidden="true" />
            )}
            {isConsuming ? tCredits("unlocking") : tCredits("unlock")}
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-center text-muted-foreground">
              {tCredits("insufficientCredits")}
            </p>
            <Button className="w-full" size="sm" variant="default" asChild>
              <Link href="/credits">
                <Coins className="w-4 h-4 mr-2" aria-hidden="true" />
                {tCredits("buyCredits")}
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

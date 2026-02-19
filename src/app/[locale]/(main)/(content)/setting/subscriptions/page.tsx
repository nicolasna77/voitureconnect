"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, CreditCard, Sparkles, Check } from "lucide-react";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      {/* Current Model */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Coins className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Système de crédits</CardTitle>
              <CardDescription>
                Payez uniquement ce que vous utilisez
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              DriveMetric utilise un système de crédits flexible. Achetez des crédits
              et utilisez-les pour débloquer les fiches techniques qui vous intéressent.
            </p>

            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span>Pas d&apos;abonnement obligatoire</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span>Crédits sans date d&apos;expiration</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span>Accès permanent aux fiches débloquées</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span>Analyse IA incluse avec chaque fiche</span>
              </li>
            </ul>

            <div className="flex gap-3 pt-2">
              <Button asChild>
                <Link href="/credits">Acheter des crédits</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/user/setting/credits">Voir mes crédits</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Subscriptions */}
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Abonnements
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Bientôt
                </span>
              </CardTitle>
              <CardDescription>
                Des formules d&apos;abonnement arrivent prochainement
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nous travaillons sur des formules d&apos;abonnement pour les utilisateurs réguliers
            et les professionnels. Restez informé pour profiter d&apos;offres avantageuses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

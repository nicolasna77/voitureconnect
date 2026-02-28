"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Gift,
  Share2,
  CheckCircle2,
  Loader2,
  Users,
  Coins,
} from "lucide-react";

interface ReferralCode {
  id: string;
  code: string;
  usedCount: number;
  createdAt: string;
  referrals: {
    id: string;
    referredUserId: string;
    rewardGiven: boolean;
    createdAt: string;
    referredUser: { id: string; name: string; createdAt: string };
  }[];
}

const BONUS_CREDITS = 3;

export default function ReferralPage() {
  const queryClient = useQueryClient();
  const [codeToCopy, setCodeToCopy] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");

  const { data: referralData, isLoading } = useQuery<ReferralCode>({
    queryKey: ["referral-code"],
    queryFn: async () => {
      const res = await axios.get("/api/referral/my-code");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: applyCode, isPending: isApplying } = useMutation({
    mutationFn: () =>
      axios.post("/api/referral/validate", { code: inputCode }),
    onSuccess: (res) => {
      setApplySuccess(res.data.message);
      setApplyError("");
      setInputCode("");
      queryClient.invalidateQueries({ queryKey: ["referral-code"] });
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        setApplyError(
          err.response?.data?.error || "Erreur lors de l'application du code"
        );
      } else {
        setApplyError("Erreur lors de l'application du code");
      }
      setApplySuccess("");
    },
  });

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCodeToCopy(true);
    toast.success("Copié !");
    setTimeout(() => setCodeToCopy(false), 2000);
  };

  const handleShare = async () => {
    if (!referralData) return;
    const shareText = `Rejoins VoitureConnect avec mon code de parrainage ${referralData.code} et reçois ${BONUS_CREDITS} crédits offerts ! voitureconnect.fr`;
    if (navigator.share) {
      await navigator.share({ text: shareText, url: "https://voitureconnect.fr" });
    } else {
      await handleCopy(shareText);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 rounded-xl border bg-muted/30 animate-pulse" />
        <div className="h-32 rounded-xl border bg-muted/30 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Programme de parrainage</h2>
        <p className="text-sm text-muted-foreground">
          Parrainez vos amis et gagnez des crédits ensemble
        </p>
      </div>

      {/* How it works */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="space-y-2">
              <div className="mx-auto h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <p className="font-medium">Partagez</p>
              <p className="text-muted-foreground text-xs">
                Envoyez votre code à vos amis
              </p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <p className="font-medium">Ils s&apos;inscrivent</p>
              <p className="text-muted-foreground text-xs">
                Ils utilisent votre code à l&apos;inscription
              </p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Coins className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <p className="font-medium">{BONUS_CREDITS} crédits chacun</p>
              <p className="text-muted-foreground text-xs">
                Vous recevez tous les deux des crédits
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="h-5 w-5 text-primary" aria-hidden="true" />
            Mon code de parrainage
          </CardTitle>
          <CardDescription>
            Partagez ce code avec vos amis pour gagner des crédits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-lg border bg-muted/50 px-4 py-3 text-center">
              <span
                className="text-3xl font-mono font-bold tracking-widest text-primary"
                aria-label={`Votre code de parrainage : ${referralData?.code}`}
              >
                {referralData?.code || "——"}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopy(referralData?.code || "")}
              aria-label="Copier le code"
            >
              {codeToCopy ? (
                <CheckCircle2
                  className="h-4 w-4 text-green-500"
                  aria-hidden="true"
                />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
              Partager
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleCopy(
                  `https://api.whatsapp.com/send?text=Rejoins VoitureConnect avec mon code ${referralData?.code} et reçois ${BONUS_CREDITS} crédits ! voitureconnect.fr`
                )
              }
            >
              WhatsApp
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Parrainages réussis</span>
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" aria-hidden="true" />
              {referralData?.usedCount || 0}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Apply a code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appliquer un code reçu</CardTitle>
          <CardDescription>
            Vous avez reçu un code de parrainage d&apos;un ami ? Entrez-le ici pour
            recevoir {BONUS_CREDITS} crédits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {applySuccess ? (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <p>{applySuccess}</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="referral-input">Code de parrainage</Label>
                <div className="flex gap-2">
                  <Input
                    id="referral-input"
                    placeholder="ex: ABC123"
                    value={inputCode}
                    onChange={(e) =>
                      setInputCode(e.target.value.toUpperCase())
                    }
                    maxLength={6}
                    className="font-mono text-center tracking-widest"
                    aria-describedby={applyError ? "apply-error" : undefined}
                  />
                  <Button
                    disabled={inputCode.length < 4 || isApplying}
                    onClick={() => {
                      setApplyError("");
                      applyCode();
                    }}
                  >
                    {isApplying ? (
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      "Appliquer"
                    )}
                  </Button>
                </div>
              </div>
              {applyError && (
                <p
                  id="apply-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {applyError}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Referrals list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mes filleuls</CardTitle>
        </CardHeader>
        <CardContent>
          {referralData?.referrals && referralData.referrals.length > 0 ? (
            <div className="space-y-2">
              {referralData.referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {referral.referredUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {referral.referredUser.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(referral.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                  </div>
                  {referral.rewardGiven && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Coins className="h-3 w-3" aria-hidden="true" />+
                      {BONUS_CREDITS} crédits
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">Aucun filleul pour l&apos;instant</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Partagez votre code pour inviter vos amis et gagner des crédits
                </p>
              </div>
              <Button size="sm" onClick={handleShare} className="gap-2 mt-1">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Partager mon code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

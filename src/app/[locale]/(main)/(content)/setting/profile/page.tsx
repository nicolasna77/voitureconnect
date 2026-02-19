"use client";

import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Calendar, Shield, AtSign, Lock } from "lucide-react";
import { AvatarUpload } from "./avatar-upload";
import { DisplayNameForm } from "./display-name-form";
import { ChangeEmailForm } from "./change-email-form";
import { ChangePasswordForm } from "./change-password-form";
import { DeleteAccountForm } from "./delete-account-form";

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-9 w-40" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) return <ProfileSkeleton />;

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Veuillez vous connecter pour accéder à votre profil.
          </p>
        </CardContent>
      </Card>
    );
  }

  const user = session.user;
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || "U";

  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const isOAuthOnly = !user.emailVerified && !!user.image?.includes("googleusercontent");

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <AvatarUpload initials={initials} />

            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold">{user.name || "Utilisateur"}</h2>
                  {user.role === "admin" && (
                    <Badge variant="default" className="gap-1">
                      <Shield className="h-3 w-3" aria-hidden="true" />
                      Admin
                    </Badge>
                  )}
                  {user.emailVerified ? (
                    <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                      Vérifié
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-amber-600 border-amber-500/30">
                      Non vérifié
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>{user.email}</span>
                </div>
                {createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <span>Membre depuis {createdAt}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            Informations personnelles
          </CardTitle>
          <CardDescription>
            Modifiez votre nom d&apos;affichage visible par les autres utilisateurs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DisplayNameForm />
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AtSign className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            Adresse email
          </CardTitle>
          <CardDescription>
            Changez votre adresse email. Un lien de confirmation sera envoyé à la nouvelle adresse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangeEmailForm />
        </CardContent>
      </Card>

      {/* Security — only show for email/password accounts */}
      {!isOAuthOnly && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Modifiez votre mot de passe. Les autres sessions actives seront déconnectées.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zone de danger</CardTitle>
          <CardDescription>
            Actions irréversibles concernant votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountForm />
        </CardContent>
      </Card>
    </div>
  );
}

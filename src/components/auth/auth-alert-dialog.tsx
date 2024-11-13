"use client";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogIn, UserPlus } from "lucide-react";

interface AuthAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  type?: "auth" | "subscription" | "custom";
  customActions?: React.ReactNode;
}

const AuthAlertDialog = ({
  isOpen,
  onClose,
  title = "Connexion requise",
  description = "Vous devez être connecté pour accéder à cette fonctionnalité.",
  type = "auth",
  customActions,
}: AuthAlertDialogProps) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
    onClose();
  };

  const handleSignUp = () => {
    router.push("/register");
    onClose();
  };

  const handleUpgrade = () => {
    router.push("/pricing");
    onClose();
  };

  const renderActions = () => {
    switch (type) {
      case "auth":
        return (
          <>
            <AlertDialogCancel className="sm:w-full">Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="sm:w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleLogin}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </AlertDialogAction>
            <AlertDialogAction
              className="sm:w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={handleSignUp}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              S&apos;inscrire
            </AlertDialogAction>
          </>
        );
      case "subscription":
        return (
          <>
            <AlertDialogCancel className="sm:w-full">Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="sm:w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleUpgrade}
            >
              Mettre à niveau
            </AlertDialogAction>
          </>
        );
      case "custom":
        return customActions;
      default:
        return null;
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          {renderActions()}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AuthAlertDialog;

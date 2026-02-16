import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";

export function ErrorState() {
  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle
              className="h-8 w-8 text-destructive"
              aria-hidden="true"
            />
          </div>
          <CardTitle className="text-xl text-balance">
            Une erreur s&apos;est produite
          </CardTitle>
          <CardDescription>
            Impossible de charger les données de cette fiche technique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/specification">
              <ChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Retour aux fiches
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

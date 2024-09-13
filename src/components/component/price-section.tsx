import { Button } from "@/components/ui/button";
import { CheckIcon, Plus } from "lucide-react";

const PriceSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container m-auto grid gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Nos Offres
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choisissez le plan qui vous convient le mieux pour votre
              entreprise.
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-start rounded-lg border bg-background p-6 shadow-sm">
            <div className="mb-4 flex w-full items-center justify-between">
              <h3 className="text-2xl font-bold">Particulier</h3>
              <div className="text-4xl font-bold">Gratuit</div>
            </div>
            <p className="mb-6 text-muted-foreground">
              Idéal pour les petites entreprises en phase de démarrage.
            </p>
            <ul className="mb-8 grid gap-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />
                Stockage de 5 Go
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />1 utilisateur
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />
                Assistance par email
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />
                Intégrations de base
              </li>
            </ul>
            <Button variant="outline" className="w-full">
              Choisir le plan
            </Button>
          </div>
          <div className="flex flex-col items-start rounded-lg border bg-background p-6 shadow-sm">
            <div className="mb-4 flex w-full items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                Particulier <Plus />
              </h3>
              <div className="text-4xl font-bold">€19</div>
            </div>
            <p className="mb-6 text-muted-foreground">
              Idéal pour les entreprises en phase de croissance.
            </p>
            <ul className="mb-8 grid gap-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />
                Stockage de 20 Go
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />5 utilisateurs
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />
                Assistance par email et chat
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />
                Intégrations avancées
              </li>
            </ul>
            <Button variant="outline" className="w-full">
              Choisir le plan
            </Button>
          </div>
          <div className="flex flex-col items-start rounded-lg border bg-background p-6 shadow-sm">
            <div className="mb-4 flex w-full items-center justify-between">
              <h3 className="text-2xl font-bold">Professionnel</h3>
              <div className="text-4xl font-bold">€49</div>
            </div>
            <p className="mb-6 text-muted-foreground">
              Idéal pour les grandes entreprises avec des besoins complexes.
            </p>
            <ul className="mb-8 grid gap-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />
                Stockage illimité
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />
                {" Nombre d'utilisateurs illimité"}
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />
                Assistance prioritaire
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 fill-primary" />
                Intégrations personnalisées
              </li>
            </ul>
            <Button variant="outline" className="w-full">
              Choisir le plan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PriceSection;

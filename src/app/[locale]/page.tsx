import { Button } from "@/components/ui/button";

import PriceSection from "@/components/component/price-section";
import { FeatureSection } from "@/components/component/feature-section";
import HeroSection from "@/components/component/hero-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CategoriSection from "@/components/categori-section";

export default function Home() {
  return (
    <div className="flex flex-col w-full ">
      <main className="m-auto  w-full">
        <HeroSection />
        <CategoriSection />
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container m-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Fonctionnalités Clés
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Garage Finder offre un ensemble complet de fonctionnalités
                  pour rationaliser la gestion de votre garage et
                  l&apos;expérience d&apos;achat/vente.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto px-4 py-12 md:py-16">
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="bg-background rounded-lg  overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Fonctionnalité 1</h3>
                    <p className="text-muted-foreground">
                      Description de la première fonctionnalité.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background rounded-lg  overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Fonctionnalité 2</h3>
                    <p className="text-muted-foreground">
                      Description de la deuxième fonctionnalité.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background rounded-lg  overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Fonctionnalité 3</h3>
                    <p className="text-muted-foreground">
                      Description de la troisième fonctionnalité.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background rounded-lg  overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Fonctionnalité 4</h3>
                    <p className="text-muted-foreground">
                      Description de la quatrième fonctionnalité.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="md:w-1/3 ">
                <Card className="">
                  <CardHeader>
                    <CardTitle>Carte en pleine hauteur</CardTitle>
                    <CardDescription>
                      Contenu de la carte en pleine hauteur.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Texte supplémentaire dans le contenu de la carte.</p>
                  </CardContent>
                  <CardFooter>
                    <Button>Bouton d&apos;action</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container m-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Avantages de l&apos;Utilisation de Garage Finder
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Garage Finder offre une gamme d&apos;avantages pour vous aider
                  à rationaliser les opérations de votre garage et à vous
                  connecter avec les acheteurs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Visibilité Accrue</h3>
                <p className="text-muted-foreground">
                  Atteignez un public plus large et obtenez plus de visibilité
                  pour votre garage et vos pièces.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Outils de Gain de Temps</h3>
                <p className="text-muted-foreground">
                  Rationalisez les opérations de votre garage avec notre suite
                  d&apos;outils de gestion.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Efficacité Améliorée</h3>
                <p className="text-muted-foreground">
                  Optimisez le flux de travail de votre garage et
                  concentrez-vous sur le service à vos clients.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Transactions Fluides</h3>
                <p className="text-muted-foreground">
                  Facilitez des transactions fluides et sécurisées entre
                  acheteurs et vendeurs.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Support Complet</h3>
                <p className="text-muted-foreground">
                  Obtenez un support dédié de notre équipe pour vous aider à
                  réussir.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Tarification Compétitive</h3>
                <p className="text-muted-foreground">
                  Profitez de plans tarifaires abordables pour répondre aux
                  besoins de votre garage.
                </p>
              </div>
            </div>
          </div>
        </section>
        <FeatureSection />
        <PriceSection />
      </main>
    </div>
  );
}

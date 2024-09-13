import { Button } from "@/components/ui/button";
import SearchSection from "@/components/component/search-section";
import { Input } from "@/components/ui/input";
import PriceSection from "@/components/component/price-section";
import { FeatureSection } from "@/components/component/feature-section";
import HeroSection from "@/components/component/hero-section";

export default function Home() {
  return (
    <div className="flex flex-col w-full ">
      <main className="m-auto  w-full">
        <HeroSection />

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
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Publier des Annonces</h3>
                <p className="text-muted-foreground">
                  Créez et publiez facilement des annonces pour votre garage ou
                  vos pièces.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Gérer l'Inventaire</h3>
                <p className="text-muted-foreground">
                  Suivez l&apos;inventaire de votre garage et l&apos;historique
                  des ventes.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">
                  Se Connecter avec les Acheteurs
                </h3>
                <p className="text-muted-foreground">
                  Communiquez directement avec les acheteurs potentiels et
                  concluez des affaires.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Outils de Planification</h3>
                <p className="text-muted-foreground">
                  Gérez vos rendez-vous de garage et les réservations des
                  clients.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Analytique</h3>
                <p className="text-muted-foreground">
                  Suivez vos ventes, votre inventaire et l'engagement des
                  clients.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Application Mobile</h3>
                <p className="text-muted-foreground">
                  Gérez votre garage en déplacement avec notre application
                  mobile.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container m-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Avantages de l'Utilisation de Garage Finder
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Garage Finder offre une gamme d'avantages pour vous aider à
                  rationaliser les opérations de votre garage et à vous
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
                  d'outils de gestion.
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

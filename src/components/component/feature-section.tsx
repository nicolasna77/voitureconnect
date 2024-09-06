import Image from "next/image";

export function FeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container m-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Nouvelles fonctionnalités
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Découvrez ce qui arrive bientôt
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nous travaillons sans relâche pour améliorer votre expérience.
              Jetez un coup d'œil à nos prochaines mises à jour.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">
                    Prise en charge des fichiers PDF
                  </h3>
                  <p className="text-muted-foreground">
                    Téléchargez, visualisez et partagez facilement vos documents
                    PDF.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Calendrier intégré</h3>
                  <p className="text-muted-foreground">
                    Gardez une trace de vos rendez-vous et événements
                    directement dans l'application.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">
                    Notifications améliorées
                  </h3>
                  <p className="text-muted-foreground">
                    Recevez des alertes en temps réel pour ne rien manquer
                    d'important.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">
                    Partage de fichiers sécurisé
                  </h3>
                  <p className="text-muted-foreground">
                    Partagez vos documents en toute confidentialité avec des
                    options de cryptage avancées.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <Image
            src="/placeholder.svg"
            width="550"
            height="310"
            alt="Image"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
        </div>
      </div>
    </section>
  );
}

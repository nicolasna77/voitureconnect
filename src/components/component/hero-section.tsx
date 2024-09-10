import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-24  lg:py-44 bg-primary-foreground">
      <div className="container m-auto px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simplifiez la gestion de votre garage
          </h1>
          <p className=" text-muted-foreground md:text-xl">
            CarConnect est votre solution unique pour déposer vos annonces entre
            professionnels et particuliers. Suivez tout sur un véhicule et
            faites-le vérifier facilement.
          </p>
          <div className="flex gap-2">
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Déposer une annonce
            </Link>
            <Link
              href="/view"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              rechercher un véhicule
            </Link>
          </div>
        </div>
        <Image
          src="/Buying a New Car Illustration.jpg"
          width="500"
          height="500"
          quality={100}
          alt="Hero"
          className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
        />
      </div>
    </section>
  );
};
export default HeroSection;

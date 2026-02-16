import Link from "next/link";
import { Gauge } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Fiches techniques", href: "/specification" },
    { label: "Credits", href: "/credits" },
    { label: "Analyse IA", href: "/specification" },
  ],
  account: [
    { label: "Mon compte", href: "/user/setting/profile" },
    { label: "Mes favoris", href: "/user/favorite" },
    { label: "Historique", href: "/user/setting/credits" },
  ],
  legal: [
    { label: "Confidentialité", href: "#" },
    { label: "CGU", href: "#" },
    { label: "Mentions légales", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-card">
      {/* Subtle top gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-105">
                <Gauge
                  className="h-5 w-5 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <span className="text-xl font-bold text-card-foreground">
                DriveMetric
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Analyse intelligente de la fiabilité et de la valeur des
              véhicules, propulsée par l{"'"}IA.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 lg:col-span-3">
            {Object.entries({
              Produit: footerLinks.product,
              "Mon compte": footerLinks.account,
              Légal: footerLinks.legal,
            }).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-card-foreground/70">
                  {title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DriveMetric. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

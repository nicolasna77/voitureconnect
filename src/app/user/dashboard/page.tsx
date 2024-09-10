// import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  BellIcon,
  Car,
  FileInputIcon,
  FileTextIcon,
  GlobeIcon,
  Heart,
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    Icon: FileTextIcon,
    name: "CarVertical",
    description: "Verifier l'historique d'une voiture avant de l'acheter.",
    href: "/",
    cta: "Voir plus",
    background: (
      <Image
        alt="CarVertical"
        width={600}
        height={600}
        src="/carVertical.webp"
        className="absolute -right-20 -top-20 opacity-60"
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Heart,
    name: "Mes favoris",
    description: "Vos coups de coeur son reuni ici.",
    href: "/",
    cta: "Voir plus",
    background: (
      <Image
        width={600}
        src={""}
        height={600}
        alt="Mes favoris"
        className="absolute -right-20 -top-20 opacity-60"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "",
    description: "Supports 100+ languages and counting.",
    href: "/",
    cta: "Learn more",

    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Car,
    name: "Mon garage",
    description: "Consulter votre stock de voiture.",
    href: "/",
    cta: "Learn more",
    background: (
      <Image
        width={600}
        src={""}
        height={600}
        alt="stock de voiture"
        className="absolute -right-20 -top-20 opacity-60"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description:
      "Get notified when someone shares a file or mentions you in a comment.",
    href: "/",
    cta: "Learn more",
    background: (
      <Image
        width={600}
        height={600}
        alt="Notifications"
        src={""}
        className="absolute -right-20 -top-20 opacity-60"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

const BentoDemo = () => {
  return (
    <div className="container min-h-screen py-8 justify-center items-center flex">
      {/* <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid> */}
    </div>
  );
};
export default BentoDemo;

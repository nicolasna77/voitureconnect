"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Search, ShieldCheck, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FeaturesSection() {
  const t = useTranslations("HomePage.features");
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const yTitle = useTransform(scrollYProgress, [0, 0.3], [20, 0]);
  const xLeft = useTransform(scrollYProgress, [0.1, 0.4], [-20, 0]);
  const xRight = useTransform(scrollYProgress, [0.1, 0.4], [20, 0]);

  const features = [
    {
      title: t("advancedInventory.title"),
      description: t("advancedInventory.description"),
      icon: Layers,
    },
    {
      title: t("smartSearch.title"),
      description: t("smartSearch.description"),
      icon: Search,
    },
    {
      title: t("enhancedSecurity.title"),
      description: t("enhancedSecurity.description"),
      icon: ShieldCheck,
    },
    {
      title: t("marketAnalysis.title"),
      description: t("marketAnalysis.description"),
      icon: TrendingUp,
    },
  ];

  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background bg-primary/15 to-secondary/20"
      ref={ref}
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          style={{ opacity, y: yTitle }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              {t("title")}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("description")}
            </p>
          </div>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          <motion.div
            style={{ opacity, x: xLeft }}
            className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-card hover:bg-accent transition-colors duration-300"
              >
                <CardContent className="p-6 flex flex-col items-start">
                  <feature.icon className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
          <motion.div style={{ opacity, x: xRight }} className="lg:w-1/3">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{t("optimize.title")}</CardTitle>
                <CardDescription>{t("optimize.description")}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">
                  {t("optimize.subtitle")}
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                  {t
                    .raw("optimize.benefits")
                    .map((benefit: string, index: number) => (
                      <li key={index}>{benefit}</li>
                    ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">{t("optimize.cta")}</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

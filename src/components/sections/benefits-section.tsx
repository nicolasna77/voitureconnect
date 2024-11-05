"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Search,
  Clock,
  TrendingUp,
  ShoppingCart,
  Headphones,
  DollarSign,
} from "lucide-react";

export default function BenefitsSection() {
  const t = useTranslations("HomePage.benefits");
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

  const benefits = [
    {
      title: t("visibility.title"),
      description: t("visibility.description"),
      icon: Search,
    },
    {
      title: t("tools.title"),
      description: t("tools.description"),
      icon: Clock,
    },
    {
      title: t("efficiency.title"),
      description: t("efficiency.description"),
      icon: TrendingUp,
    },
    {
      title: t("transactions.title"),
      description: t("transactions.description"),
      icon: ShoppingCart,
    },
    {
      title: t("support.title"),
      description: t("support.description"),
      icon: Headphones,
    },
    {
      title: t("pricing.title"),
      description: t("pricing.description"),
      icon: DollarSign,
    },
  ];

  return (
    <section
      ref={ref}
      id="benefits"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/20"
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          style={{ opacity, y }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
              {t("title")}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("description")}
            </p>
          </div>
        </motion.div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col items-center text-center p-4 rounded-lg bg-card hover:bg-card/80 transition-colors"
            >
              <div className="mb-4 p-2 rounded-full bg-primary/10">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

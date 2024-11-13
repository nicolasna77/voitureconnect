"use client";

import Image from "next/image";
import SearchForm from "../search/search-form";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const t = useTranslations("HomePage.hero");
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yText = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const xImage = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section
      className="relative overflow-hidden bg-[#f2F2F2] py-20 lg:py-32"
      ref={ref}
    >
      <div className="container relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <motion.div
            style={{ opacity, y: yText, scale }}
            className="max-w-2xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-primary lg:text-6xl"
            >
              {t("title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              {t("description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8"
            >
              <SearchForm />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ opacity, x: xImage }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative h-[400px] lg:h-[600px]"
          >
            <Image
              src="/data/illustration/car-insurance.svg"
              alt="Hero illustration"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* Décoration d'arrière-plan */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent)]" />
    </section>
  );
};

export default HeroSection;

"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CheckIcon, Sparkles } from "lucide-react";

export default function SectionTarifs() {
  const t = useTranslations("HomePage.pricing");
  const [isAnnual, setIsAnnual] = useState(false);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

  const cardOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const cardY = useTransform(scrollYProgress, [0.1, 0.3], [100, 0]);

  const plans = [
    {
      key: "basic",
      price: 0,
      variant: "outline" as const,
    },
    {
      key: "premium",
      price: isAnnual ? 108 : 10,
      variant: "default" as const,
    },
    {
      key: "pro",
      price: isAnnual ? 540 : 50,
      variant: "outline" as const,
      recommended: true,
    },
  ];

  return (
    <section
      ref={ref}
      className="bg-gradient-to-b from-background bg-primary/15 to-secondary/20 py-24 lg:py-32"
    >
      <div className="container">
        <motion.div
          style={{ opacity, y }}
          className="max-w-2xl mx-auto text-center mb-10 lg:mb-14"
        >
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl text-primary">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>
        </motion.div>

        <motion.div
          style={{ opacity, y }}
          className="flex py-4 justify-center items-center mb-8"
        >
          <div className="flex items-center space-x-2 bg-secondary/50 p-1 rounded-full">
            <Label
              htmlFor="payment-schedule-monthly"
              className={`cursor-pointer rounded-full px-3 py-1 text-sm ${
                !isAnnual ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {t("billing.monthly")}
            </Label>
            <Switch
              id="payment-schedule"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label
              htmlFor="payment-schedule-annual"
              className={`cursor-pointer rounded-full px-3 py-1 text-sm ${
                isAnnual ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {t("billing.annual")}
              <span className="ml-1 text-xs font-bold text-green-500">
                {t("billing.discount")}
              </span>
            </Label>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.key}
              style={{
                opacity: cardOpacity,
                y: cardY,
              }}
              className={`${
                plan.recommended ? "order-first lg:order-none" : ""
              }`}
            >
              <Card
                className={`h-full flex flex-col transition-all duration-300 ${
                  plan.recommended ? "border-primary shadow-lg scale-105" : ""
                } hover:shadow-md hover:scale-[1.02]`}
              >
                <CardHeader className="text-center pb-2 flex-grow">
                  {plan.recommended && (
                    <Badge
                      className="absolute top-4 right-4 uppercase font-semibold"
                      variant="default"
                    >
                      <Sparkles className="mr-1 h-3 w-3" />{" "}
                      {t(`plans.${plan.key}.recommended`)}
                    </Badge>
                  )}
                  <CardTitle className="text-xl mb-2">
                    {t(`plans.${plan.key}.title`)}
                  </CardTitle>
                  <span className="text-4xl font-bold">
                    {plan.price}€
                    <span className="text-sm font-normal text-muted-foreground">
                      /
                      {isAnnual
                        ? t("billing.annual").toLowerCase()
                        : t("billing.monthly").toLowerCase()}
                    </span>
                  </span>
                  <CardDescription className="mt-2">
                    {t(`plans.${plan.key}.description`)}
                    <br />
                    <span className="font-semibold">
                      {t(`plans.${plan.key}.features`).length}{" "}
                      {t("plans.featuresCount")}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="mt-4 space-y-3 text-sm">
                    {(Array.isArray(t(`plans.${plan.key}.features`))
                      ? (t(`plans.${plan.key}.features`) as unknown as string[])
                      : []
                    ).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center">
                        <CheckIcon className="text-primary mr-2 h-4 w-4 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button className="w-full" variant={plan.variant}>
                    {t(`plans.${plan.key}.cta`)}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

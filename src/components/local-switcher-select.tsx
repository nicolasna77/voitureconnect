"use client";

import clsx from "clsx";
import { ReactNode, useEffect, useState, useTransition } from "react";
import { Locale, usePathname, useRouter } from "@/i18n/routing";
import { Select } from "./ui/select";

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onSelectChange(value: string) {
    const nextLocale = value as Locale;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  if (!mounted) {
    return (
      <label className="relative text-gray-400">
        <p className="sr-only">{label}</p>
        <div className="flex h-9 w-[70px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm">
          {defaultValue.toUpperCase()}
        </div>
      </label>
    );
  }

  return (
    <label
      className={clsx(
        "relative text-gray-400",
        isPending && "transition-opacity [&:disabled]:opacity-30"
      )}
    >
      <p className="sr-only">{label}</p>
      <Select
        defaultValue={defaultValue}
        disabled={isPending}
        onValueChange={onSelectChange}
      >
        {children}
      </Select>
    </label>
  );
}

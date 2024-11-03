import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
export enum LANGUAGE {
  FR = "fr",
  EN = "en",
}

export const locales = [LANGUAGE.FR, LANGUAGE.EN];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) {
    notFound();
  }
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

/**
 * Builds an imagin.studio URL for a given car make / model / year.
 *
 * Requires NEXT_PUBLIC_IMAGIN_CUSTOMER to be set in .env.local
 * Sign up (free) at: https://www.imagin.studio/car-image-api
 *
 * Returns null when the customer ID is not configured.
 */
export function getImaginstudioUrl(
  make: string,
  model: string,
  year?: string | null
): string | null {
  const customer = process.env.NEXT_PUBLIC_IMAGIN_CUSTOMER;
  if (!customer) return null;

  const slug = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const params = new URLSearchParams({
    customer,
    make: slug(make),
    modelFamily: slug(model),
    zoomType: "fullscreen",
    width: "640",
  });

  const cleanYear = year?.replace("NULL", "").trim();
  if (cleanYear) params.set("modelYear", cleanYear);

  return `https://cdn.imagin.studio/getimage?${params.toString()}`;
}

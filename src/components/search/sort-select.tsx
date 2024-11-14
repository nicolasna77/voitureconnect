import { useRouter } from "next/navigation";

import { usePathname } from "next/navigation";

import { useSearchParams } from "next/dist/client/components/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from "../ui/select";

const SortSelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set("page", "1");
      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      router.push(`${pathname}?${createQueryString("sort", value)}`);
    },
    [router, pathname, createQueryString]
  );

  return (
    <Select
      defaultValue={searchParams.get("sort") || ""}
      onValueChange={handleSortChange}
    >
      <SelectTrigger className="bg-background w-full">
        <SelectValue placeholder="Trier par" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="price_desc">Prix décroissant</SelectItem>
        <SelectItem value="price_asc">Prix croissant</SelectItem>
        <SelectItem value="date_desc">Date décroissant</SelectItem>
        <SelectItem value="date_asc">Date croissant</SelectItem>
      </SelectContent>
    </Select>
  );
};
export default SortSelect;

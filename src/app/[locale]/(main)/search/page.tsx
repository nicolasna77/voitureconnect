"use client";
import { Button } from "@/components/ui/button";
import ListProduct from "../../../../components/component/list-product";
import SearchForm from "../../../../components/component/search-form";
import { FilterIcon, LayoutGrid, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Ad, Car } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import PaginationComponant from "@/components/component/pagination";
import { useSession } from "next-auth/react";
import FilterSearch from "@/components/filter-search";
import { Switch } from "@/components/ui/switch";

type AdWithCar = Ad & {
  car: Car;
  isLiked: boolean;
  idLike: string | null;
};

type AdResponse = {
  data: AdWithCar[];
  page: number;
  totalPages: number;
  total: number;
};

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const { data: session } = useSession();
  const [orientation, setOrientation] = useState<"grid" | "list">("grid");

  const handlePageChange = useCallback(
    (newPage: number) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("page", newPage.toString());
      router.push(`/search?${currentParams.toString()}`);
      setPage(newPage);
    },
    [router, searchParams]
  );

  const { isPending, isError, data, error } = useQuery<AdResponse>({
    queryKey: ["annonces", searchParams.toString(), session?.user],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const url = `/api/ad?${searchParams.toString()}`;
      const finalUrl = session?.user?.id
        ? `${url}&userId=${session.user.id}`
        : url;
      const response = await axios.get<AdResponse>(finalUrl);
      return response.data;
    },
    enabled: !!searchParams && !!session?.user,
  });

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  if (data?.total && total !== data.total) {
    setTotal(data.total);
  }

  return (
    <div className="py-8">
      <SearchForm />
      <div className="mx-auto py-12">
        <div className="flex items-center justify-between">
          <div className="py-4">Total résultat: {total}</div>
          <div className="flex items-center gap-2">
            <Switch
              checked={orientation === "list"}
              onCheckedChange={(checked) =>
                setOrientation(checked ? "list" : "grid")
              }
              className="data-[state=checked]:bg-primary"
            >
              <List className="h-4 w-4 data-[state=unchecked]:block data-[state=checked]:hidden" />
              <LayoutGrid className="h-4 w-4 data-[state=unchecked]:hidden data-[state=checked]:block" />
              <span className="sr-only">Changer l&apos;orientation</span>
            </Switch>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={toggleFilters}
              >
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only">Filtrer</span>
              </Button>
            </div>
            <Select>
              <SelectTrigger className="bg-background w-full">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_desc">
                  Trier par prix (décroissant)
                </SelectItem>
                <SelectItem value="price_asc">
                  Trier par prix (croissant)
                </SelectItem>
                <SelectItem value="date_desc">
                  Trier par date (décroissant)
                </SelectItem>
                <SelectItem value="date_asc">
                  Trier par date (croissant)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="sm:grid py-8 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {showFilters && (
            <div className="col-span-1">
              <FilterSearch
                showFilters={showFilters}
                setShowFilters={setShowFilters}
              />
            </div>
          )}
          <div
            className={`w-full ${
              showFilters ? "col-span-full md:col-span-3" : "col-span-full"
            }`}
          >
            <ListProduct
              data={data?.data}
              orientation={orientation}
              isPending={isPending}
              isError={isError}
              error={error}
            />
          </div>
        </div>
      </div>
      {data?.data?.length !== 0 && (
        <PaginationComponant
          page={page}
          totalPages={data?.totalPages || 0}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SearchPage;

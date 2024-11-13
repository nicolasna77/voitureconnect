"use client";

import ListProduct from "../../../../components/list/list-product";
import SearchForm from "../../../../components/search/search-form";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import PaginationComponant from "@/components/component/pagination";
import { useSession } from "next-auth/react";
import FilterSearch from "@/components/search/filter-search";
import { AdWithCar } from "@/types/car";
import SearchItemSelect from "@/components/search/search-item-select";
import ViewToggle from "@/components/search/view-toggle";
import FilterToggle from "@/components/search/filter-toggle";
import ResetButton from "@/components/search/reset-button";
import SortSelect from "@/components/search/sort-select";
import { Orientation } from "@/hooks/useOrientation";

type AdResponse = {
  data: AdWithCar[];
  page: number;
  totalPages: number;
  total: number;
};

type FilterState = {
  category: string;
  vehicleType: string;
  fuelType: string;
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
  transmission: string;
  kmMin: string;
  kmMax: string;
};

interface SearchClientProps {
  initialOrientation: Orientation;
}

const SearchClient = ({ initialOrientation }: SearchClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [orientation, setOrientation] =
    useState<Orientation>(initialOrientation);
  const [showFilters, setShowFilters] = useState(false);
  const { data: session } = useSession();

  const removeParam = useCallback(
    (param: string) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.delete(param);
      router.push(`/search?${currentParams.toString()}`);
    },
    [router, searchParams]
  );

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
    queryKey: ["annonces", searchParams.toString(), session?.user?.id],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (session?.user?.id) {
        headers["X-User-Id"] = session.user.id;
      }

      const { data: responseData } = await axios.get<AdResponse>(
        `/api/ad?${searchParams.toString()}`,
        { headers }
      );

      return responseData;
    },
    enabled: true,
  });

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleFilterChange = useCallback(
    (filters: FilterState) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          currentParams.set(key, value);
        } else {
          currentParams.delete(key);
        }
      });

      router.push(`/search?${currentParams.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="py-8">
      <SearchForm />
      <div className="mx-auto py-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterToggle
              defaultShowFilters={showFilters}
              toggleFilters={toggleFilters}
            />
            <div className="py-4">Total résultat: {data?.total}</div>
          </div>
          <div className="flex-1 flex justify-center">
            <SearchItemSelect onRemoveParam={removeParam} />
          </div>
          <div className="flex items-center gap-2">
            <ViewToggle
              defaultOrientation={orientation}
              onChange={setOrientation}
            />
            <ResetButton />
            <SortSelect />
          </div>
        </div>
        <div className="sm:grid py-8 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {showFilters && (
            <div className="col-span-1">
              <FilterSearch
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                onFilterChange={handleFilterChange}
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

export default SearchClient;

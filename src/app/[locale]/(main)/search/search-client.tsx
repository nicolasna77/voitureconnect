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
import useOrientation, { Orientation } from "@/hooks/useOrientation";
import useFilters from "@/hooks/useFilters";

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
  initialShowFilters: boolean;
}

const SearchClient = ({
  initialOrientation,
  initialShowFilters,
}: SearchClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const { orientation, updateOrientation } = useOrientation(initialOrientation);
  const { showFilters, toggleFilters } = useFilters(initialShowFilters);
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
        <div className="flex items-center gap-2 flex-wrap justify-between">
          <div className="flex items-center ">
            <FilterToggle
              defaultShowFilters={showFilters}
              toggleFilters={toggleFilters}
            />
          </div>
          <div className="flex-1 flex justify-center">
            <SearchItemSelect onRemoveParam={removeParam} />
          </div>
          <div className="flex items-center gap-2">
            <ViewToggle
              defaultOrientation={orientation}
              onChange={updateOrientation}
            />
            <ResetButton />
            <SortSelect />
          </div>
        </div>
        <div className="sm:grid py-8 grid-cols-8 gap-4">
          {showFilters && (
            <div className="col-span-3 md:col-span-3 lg:col-span-2 ">
              <FilterSearch
                showFilters={showFilters}
                setShowFilters={toggleFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
          <div
            className={`w-full ${
              showFilters ? "col-span-full lg:col-span-6" : "col-span-full"
            }`}
          >
            <ListProduct
              data={data?.data}
              orientation={orientation}
              isPending={isPending}
              filters={showFilters}
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

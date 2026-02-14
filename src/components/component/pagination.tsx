import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponant = ({
  page,
  totalPages,
  handlePageChange,
}: {
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null; // Ne pas afficher la pagination s'il n'y a qu'une seule page

  const currentPage = Math.max(1, Math.min(page, totalPages)); // Assurez-vous que la page est dans les limites

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination className="pb-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="cursor-pointer"
          />
        </PaginationItem>

        {pageNumbers.map((number) => {
          if (
            number === 1 ||
            number === totalPages ||
            (number >= currentPage - 2 && number <= currentPage + 2)
          ) {
            return (
              <PaginationItem key={number} className="cursor-pointer">
                <PaginationLink
                  isActive={currentPage === number}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            );
          } else if (number === currentPage - 3 || number === currentPage + 3) {
            return (
              <PaginationItem key={number}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return null;
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="cursor-pointer"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponant;

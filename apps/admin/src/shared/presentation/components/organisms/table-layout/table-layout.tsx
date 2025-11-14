"use client";

import {
  DynamicFilter,
  DynamicFilters,
  FilterField,
} from "@/shared/presentation/components/organisms/dynamic-filters/dynamic-filters";
import { Input } from "@repo/ui/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/ui/pagination";
import { cn } from "@repo/ui/lib/utils";
import { SearchIcon } from "lucide-react";
import * as React from "react";

// Re-export types for convenience
export type { DynamicFilter, FilterField };

interface TableLayoutProps {
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  // Dynamic Filters
  filterFields?: FilterField[];
  filterOperators?: { label: string; value: string }[];
  filters?: DynamicFilter[];
  onFiltersChange?: (filters: DynamicFilter[]) => void;
  // Pagination
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // Content
  children: React.ReactNode;
  className?: string;
}

export function TableLayout({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterFields = [],
  filterOperators = [],
  filters = [],
  onFiltersChange,
  page = 1,
  totalPages = 0,
  onPageChange,
  children,
  className,
}: TableLayoutProps) {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && onPageChange) {
      onPageChange(newPage);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, current, and ellipsis
      pages.push(1);

      if (page > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              size="default"
              onClick={() => handlePageChange(page - 1)}
              className={cn(page === 1 && "pointer-events-none opacity-50")}
            />
          </PaginationItem>

          {pages.map((p, index) => (
            <PaginationItem key={index}>
              {p === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  size="icon"
                  onClick={() => handlePageChange(p)}
                  isActive={p === page}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              size="default"
              onClick={() => handlePageChange(page + 1)}
              className={cn(
                page === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Search */}
      {onSearchChange && (
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Dynamic Filters */}
      {filterFields.length > 0 && onFiltersChange && (
        <DynamicFilters
          fields={filterFields}
          operators={filterOperators}
          filters={filters}
          onFiltersChange={onFiltersChange}
        />
      )}

      {/* Table Content */}
      {children}

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
}

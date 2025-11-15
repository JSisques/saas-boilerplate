import { cn } from "@repo/shared/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export type SortDirection = "ASC" | "DESC";

export interface Sort {
  field: string;
  direction: SortDirection;
}

export interface ColumnDef<T> {
  /**
   * Unique identifier for the column
   */
  id: string;
  /**
   * Header label to display
   */
  header: string;
  /**
   * Accessor function or key to get the value from the row data
   */
  accessor?: keyof T | ((row: T) => React.ReactNode);
  /**
   * Custom cell renderer. If provided, this takes precedence over accessor
   */
  cell?: (row: T) => React.ReactNode;
  /**
   * Whether this column is sortable
   */
  sortable?: boolean;
  /**
   * Field name to use for sorting (defaults to column id)
   */
  sortField?: string;
  /**
   * Additional className for the header cell
   */
  headerClassName?: string;
  /**
   * Additional className for the body cells in this column
   */
  cellClassName?: string;
}

export interface DataTableProps<T> {
  /**
   * Array of data to display
   */
  data: T[];
  /**
   * Column definitions
   */
  columns: ColumnDef<T>[];
  /**
   * Function to get a unique key for each row
   */
  getRowId?: (row: T) => string | number;
  /**
   * Callback when a row is clicked
   */
  onRowClick?: (row: T) => void;
  /**
   * Current sort configuration
   */
  sorts?: Sort[];
  /**
   * Callback when sort changes
   */
  onSortChange?: (sorts: Sort[]) => void;
  /**
   * Message to display when there's no data
   */
  emptyMessage?: string;
  /**
   * Additional className for the table
   */
  className?: string;
  /**
   * Additional className for table rows
   */
  rowClassName?: string | ((row: T) => string);
}

/**
 * Generic DataTable component for displaying tabular data
 * @example
 * ```tsx
 * const columns: ColumnDef<User>[] = [
 *   {
 *     id: "name",
 *     header: "Name",
 *     accessor: "name",
 *   },
 *   {
 *     id: "email",
 *     header: "Email",
 *     accessor: (row) => row.email,
 *   },
 *   {
 *     id: "actions",
 *     header: "Actions",
 *     cell: (row) => <Button onClick={() => handleEdit(row)}>Edit</Button>,
 *   },
 * ];
 *
 * <DataTable
 *   data={users}
 *   columns={columns}
 *   getRowId={(row) => row.id}
 *   onRowClick={(row) => console.log(row)}
 * />
 * ```
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  getRowId,
  onRowClick,
  sorts = [],
  onSortChange,
  emptyMessage = "No data found",
  className,
  rowClassName,
}: DataTableProps<T>) {
  const handleSort = (column: ColumnDef<T>) => {
    if (!column.sortable || !onSortChange) return;

    const sortField = column.sortField || column.id;
    const currentSort = sorts.find((s) => s.field === sortField);

    let newSorts: Sort[];

    if (!currentSort) {
      // No sort for this column, add ASC
      newSorts = [...sorts, { field: sortField, direction: "ASC" }];
    } else if (currentSort.direction === "ASC") {
      // Change from ASC to DESC
      newSorts = sorts.map((s) =>
        s.field === sortField ? { ...s, direction: "DESC" } : s
      );
    } else {
      // Remove sort (DESC -> no sort)
      newSorts = sorts.filter((s) => s.field !== sortField);
    }

    onSortChange(newSorts);
  };

  const getSortIcon = (column: ColumnDef<T>) => {
    if (!column.sortable) return null;

    const sortField = column.sortField || column.id;
    const currentSort = sorts.find((s) => s.field === sortField);

    if (!currentSort) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }

    return currentSort.direction === "ASC" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };
  const getRowKey = (row: T, index: number): string | number => {
    if (getRowId) {
      return getRowId(row);
    }
    // Try to find common id fields
    if ("id" in row && typeof row.id === "string") {
      return row.id;
    }
    if ("id" in row && typeof row.id === "number") {
      return row.id;
    }
    return index;
  };

  const getCellValue = (column: ColumnDef<T>, row: T): React.ReactNode => {
    // If custom cell renderer is provided, use it
    if (column.cell) {
      return column.cell(row);
    }

    // If accessor is a function, call it
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }

    // If accessor is a key, get the value
    if (column.accessor) {
      const value = row[column.accessor];
      return value !== null && value !== undefined ? String(value) : "-";
    }

    return "-";
  };

  const getRowClassNames = (row: T): string => {
    const baseClass = onRowClick ? "cursor-pointer" : "";
    if (typeof rowClassName === "function") {
      return cn(baseClass, rowClassName(row));
    }
    return cn(baseClass, rowClassName);
  };

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={cn(
                column.headerClassName,
                column.sortable &&
                  onSortChange &&
                  "cursor-pointer select-none hover:bg-muted/50"
              )}
              onClick={() => handleSort(column)}
            >
              <div className="flex items-center">
                {column.header}
                {getSortIcon(column)}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, index) => (
            <TableRow
              key={getRowKey(row, index)}
              onClick={() => onRowClick?.(row)}
              className={getRowClassNames(row)}
            >
              {columns.map((column) => (
                <TableCell key={column.id} className={column.cellClassName}>
                  {getCellValue(column, row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

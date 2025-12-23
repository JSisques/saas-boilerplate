import { cn } from '@repo/shared/presentation/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import * as React from 'react';
import { Checkbox } from './checkbox';
import { Input } from './input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

export type SortDirection = 'ASC' | 'DESC';

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
  /**
   * Whether this column is editable
   */
  editable?: boolean;
  /**
   * Custom input type for editable cells (defaults to "text")
   */
  inputType?: 'text' | 'number' | 'email' | 'tel' | 'url';
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
  /**
   * Callback when a cell is edited
   */
  onCellEdit?: (row: T, columnId: string, newValue: string) => void;
  /**
   * Enable row selection with checkboxes
   */
  enableRowSelection?: boolean;
  /**
   * Selected row IDs
   */
  selectedRowIds?: Set<string | number>;
  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selectedRowIds: Set<string | number>) => void;
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
 *     editable: true,
 *   },
 *   {
 *     id: "email",
 *     header: "Email",
 *     accessor: (row) => row.email,
 *     editable: true,
 *     inputType: "email",
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
 *   onCellEdit={(row, columnId, newValue) => {
 *     console.log(`Editing ${columnId} of row ${row.id} to ${newValue}`);
 *     // Update your data here
 *   }}
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
  emptyMessage = 'No data found',
  className,
  rowClassName,
  onCellEdit,
  enableRowSelection = false,
  selectedRowIds,
  onSelectionChange,
}: DataTableProps<T>) {
  const [editingCell, setEditingCell] = React.useState<{
    rowId: string | number;
    columnId: string;
  } | null>(null);
  const [editValue, setEditValue] = React.useState<string>('');

  // Internal state for selection if not controlled
  const [internalSelectedRowIds, setInternalSelectedRowIds] = React.useState<
    Set<string | number>
  >(new Set());

  // Use controlled or internal state
  const currentSelectedRowIds =
    selectedRowIds !== undefined ? selectedRowIds : internalSelectedRowIds;
  const setSelectedRowIds = React.useCallback(
    (newSelection: Set<string | number>) => {
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      } else {
        setInternalSelectedRowIds(newSelection);
      }
    },
    [onSelectionChange],
  );
  const handleSort = (column: ColumnDef<T>) => {
    if (!column.sortable || !onSortChange) return;

    const sortField = column.sortField || column.id;
    const currentSort = sorts.find((s) => s.field === sortField);

    let newSorts: Sort[];

    if (!currentSort) {
      // No sort for this column, add ASC
      newSorts = [...sorts, { field: sortField, direction: 'ASC' }];
    } else if (currentSort.direction === 'ASC') {
      // Change from ASC to DESC
      newSorts = sorts.map((s) =>
        s.field === sortField ? { ...s, direction: 'DESC' } : s,
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

    return currentSort.direction === 'ASC' ? (
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
    if ('id' in row && typeof row.id === 'string') {
      return row.id;
    }
    if ('id' in row && typeof row.id === 'number') {
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
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }

    // If accessor is a key, get the value
    if (column.accessor) {
      const value = row[column.accessor];
      return value !== null && value !== undefined ? String(value) : '-';
    }

    return '-';
  };

  const getCellRawValue = (column: ColumnDef<T>, row: T): string => {
    // For editable cells, we need the raw value, not the rendered cell
    // If accessor is a function, call it and convert to string
    if (typeof column.accessor === 'function') {
      const value = column.accessor(row);
      return value !== null && value !== undefined ? String(value) : '';
    }

    // If accessor is a key, get the value
    if (column.accessor) {
      const value = row[column.accessor];
      return value !== null && value !== undefined ? String(value) : '';
    }

    // Fallback: try to get value from row using column id
    const value = row[column.id as keyof T];
    return value !== null && value !== undefined ? String(value) : '';
  };

  const handleCellDoubleClick = (
    row: T,
    column: ColumnDef<T>,
    rowKey: string | number,
  ) => {
    if (!column.editable || !onCellEdit) return;

    const rawValue = getCellRawValue(column, row);
    setEditingCell({ rowId: rowKey, columnId: column.id });
    setEditValue(rawValue);
  };

  const handleCellEditSave = () => {
    if (!editingCell || !onCellEdit) return;

    const row = data.find((r) => {
      const rowKey = getRowKey(r, data.indexOf(r));
      return rowKey === editingCell.rowId;
    });

    if (row) {
      onCellEdit(row, editingCell.columnId, editValue);
    }

    setEditingCell(null);
    setEditValue('');
  };

  const handleCellEditCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleCellEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCellEditSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCellEditCancel();
    }
  };

  const getRowClassNames = (row: T): string => {
    const baseClass = onRowClick ? 'cursor-pointer' : '';
    if (typeof rowClassName === 'function') {
      return cn(baseClass, rowClassName(row));
    }
    return cn(baseClass, rowClassName);
  };

  // Selection handlers
  const handleRowSelection = (rowKey: string | number, checked: boolean) => {
    const newSelection = new Set<string | number>(currentSelectedRowIds);
    if (checked) {
      newSelection.add(rowKey);
    } else {
      newSelection.delete(rowKey);
    }
    setSelectedRowIds(newSelection);
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    const isChecked = checked === true;
    if (isChecked) {
      const allRowIds = new Set<string | number>(
        data.map((row, index) => getRowKey(row, index)),
      );
      setSelectedRowIds(allRowIds);
    } else {
      setSelectedRowIds(new Set<string | number>());
    }
  };

  const isAllSelected =
    data.length > 0 &&
    data.every((row, index) => {
      const rowKey = getRowKey(row, index);
      return currentSelectedRowIds.has(rowKey);
    });

  const isIndeterminate =
    !isAllSelected &&
    data.some((row, index) => {
      const rowKey = getRowKey(row, index);
      return currentSelectedRowIds.has(rowKey);
    });

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {enableRowSelection && (
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all rows"
              />
            </TableHead>
          )}
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={cn(
                column.headerClassName,
                column.sortable &&
                  onSortChange &&
                  'cursor-pointer select-none hover:bg-muted/50',
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
              colSpan={enableRowSelection ? columns.length + 1 : columns.length}
              className="text-center text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, index) => {
            const rowKey = getRowKey(row, index);
            const isRowSelected = currentSelectedRowIds.has(rowKey);
            return (
              <TableRow
                key={rowKey}
                onClick={() => onRowClick?.(row)}
                className={getRowClassNames(row)}
              >
                {enableRowSelection && (
                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isRowSelected}
                      onCheckedChange={(checked: boolean | 'indeterminate') => {
                        handleRowSelection(rowKey, checked === true);
                      }}
                      aria-label={`Select row ${rowKey}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => {
                  const isEditing =
                    editingCell?.rowId === rowKey &&
                    editingCell?.columnId === column.id;

                  return (
                    <TableCell
                      key={column.id}
                      className={cn(
                        column.cellClassName,
                        column.editable && 'cursor-text',
                      )}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleCellDoubleClick(row, column, rowKey);
                      }}
                      onClick={(e) => {
                        if (column.editable) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {isEditing ? (
                        <Input
                          type={column.inputType || 'text'}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellEditSave}
                          onKeyDown={handleCellEditKeyDown}
                          className="h-8 w-full"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onDoubleClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        getCellValue(column, row)
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

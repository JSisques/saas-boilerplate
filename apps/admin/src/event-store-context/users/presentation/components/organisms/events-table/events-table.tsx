'use client';

import { useEventsTableColumns } from '@/event-store-context/users/presentation/hooks/use-events-table-columns/use-events-table-columns';
import type { EventResponse } from '@repo/sdk';
import {
  DynamicFilter,
  TableLayout,
} from '@repo/shared/presentation/components/organisms/table-layout';
import type { Sort } from '@repo/shared/presentation/components/ui/data-table';
import { DataTable } from '@repo/shared/presentation/components/ui/data-table';
import { useTranslations } from 'next-intl';

interface EventsTableProps {
  events: EventResponse[];
  onEventClick?: (eventId: string) => void;
  className?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: DynamicFilter[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  sorts?: Sort[];
  onSortChange?: (sorts: Sort[]) => void;
  onCellEdit?: (
    event: EventResponse,
    columnId: string,
    newValue: string,
  ) => void;
}

export function EventsTable({
  events,
  onEventClick,
  className,
  searchValue,
  onSearchChange,
  filters,
  page,
  totalPages,
  onPageChange,
  sorts,
  onSortChange,
  onCellEdit,
}: EventsTableProps) {
  const t = useTranslations('eventsPage.organisms.eventsTable');
  const eventsTableColumns = useEventsTableColumns();
  return (
    <TableLayout
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={t('searchPlaceholder')}
      filters={filters}
      page={page}
      totalPages={totalPages || 0}
      onPageChange={onPageChange}
    >
      <DataTable
        data={events}
        columns={eventsTableColumns}
        getRowId={(event) => event.id}
        onRowClick={
          onEventClick ? (event) => onEventClick(event.id) : undefined
        }
        sorts={sorts}
        onSortChange={onSortChange}
        emptyMessage={t('emptyMessage')}
        className={className}
        onCellEdit={onCellEdit}
      />
    </TableLayout>
  );
}

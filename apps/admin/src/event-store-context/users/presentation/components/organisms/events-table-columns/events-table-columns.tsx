'use client';

import type { EventResponse } from '@repo/sdk';
import { formatDate } from '@repo/shared/application/services/format-date.service';
import type { ColumnDef } from '@repo/shared/presentation/components/ui/data-table';

export const eventsTableColumns: ColumnDef<EventResponse>[] = [
  {
    id: 'eventType',
    header: 'Event Type',
    cell: (event) => (
      <span className="text-muted-foreground">{event.eventType}</span>
    ),
    sortable: false,
  },
  {
    id: 'aggregateType',
    header: 'Aggregate Type',
    cell: (event) => (
      <span className="text-muted-foreground">{event.aggregateType}</span>
    ),
    sortable: true,
    sortField: 'aggregateType',
  },
  {
    id: 'aggregateId',
    header: 'Aggregate ID',
    cell: (event) => (
      <span className="text-muted-foreground">{event.aggregateId}</span>
    ),
    sortable: true,
    sortField: 'aggregateId',
  },
  {
    id: 'payload',
    header: 'Payload',
    cell: (event) => (
      <span className="text-muted-foreground">{event.payload}</span>
    ),
    sortable: true,
    sortField: 'payload',
  },
  {
    id: 'timestamp',
    header: 'Timestamp',
    cell: (event) => formatDate(event.timestamp),
    sortable: true,
    sortField: 'timestamp',
  },
  {
    id: 'createdAt',
    header: 'Created At',
    cell: (event) => formatDate(event.createdAt),
    sortable: true,
    sortField: 'createdAt',
  },
  {
    id: 'updatedAt',
    header: 'Updated At',
    cell: (event) => formatDate(event.updatedAt),
    sortable: true,
    sortField: 'updatedAt',
  },
];

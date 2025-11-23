'use client';

import type { EventResponse } from '@repo/sdk';
import { formatDate } from '@repo/shared/application/services/format-date.service';
import type { ColumnDef } from '@repo/shared/presentation/components/ui/data-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export const useEventsTableColumns = (): ColumnDef<EventResponse>[] => {
  const t = useTranslations('eventsPage.organisms.eventsTableColumns');

  return useMemo(
    () => [
      {
        id: 'eventType',
        header: t('eventType'),
        cell: (event) => (
          <span className="text-muted-foreground">{event.eventType}</span>
        ),
        sortable: false,
      },
      {
        id: 'aggregateType',
        header: t('aggregateType'),
        cell: (event) => (
          <span className="text-muted-foreground">{event.aggregateType}</span>
        ),
        sortable: true,
        sortField: 'aggregateType',
      },
      {
        id: 'aggregateId',
        header: t('aggregateId'),
        cell: (event) => (
          <span className="text-muted-foreground">{event.aggregateId}</span>
        ),
        sortable: true,
        sortField: 'aggregateId',
      },
      {
        id: 'payload',
        header: t('payload'),
        cell: (event) => (
          <span className="text-muted-foreground">{event.payload}</span>
        ),
        sortable: true,
        sortField: 'payload',
      },
      {
        id: 'timestamp',
        header: t('timestamp'),
        cell: (event) => formatDate(event.timestamp),
        sortable: true,
        sortField: 'timestamp',
      },
      {
        id: 'createdAt',
        header: t('createdAt'),
        cell: (event) => formatDate(event.createdAt),
        sortable: true,
        sortField: 'createdAt',
      },
      {
        id: 'updatedAt',
        header: t('updatedAt'),
        cell: (event) => formatDate(event.updatedAt),
        sortable: true,
        sortField: 'updatedAt',
      },
    ],
    [t],
  );
};

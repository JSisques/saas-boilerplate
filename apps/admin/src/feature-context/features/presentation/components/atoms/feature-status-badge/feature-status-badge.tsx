'use client';

import { FeatureStatus } from '@repo/sdk';
import { Badge } from '@repo/shared/presentation/components/ui/badge';

interface FeatureStatusBadgeProps {
  status: FeatureStatus;
}

export function FeatureStatusBadge({ status }: FeatureStatusBadgeProps) {
  const variant =
    status === 'ACTIVE'
      ? 'default'
      : status === 'INACTIVE'
        ? 'secondary'
        : 'destructive';

  return <Badge variant={variant}>{status}</Badge>;
}

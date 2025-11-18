'use client';

import { HealthStatusBadge } from '@/health-context/health/presentation/components/atoms/health-status-badge/health-status-badge';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/shared/presentation/components/ui/alert';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { Spinner } from '@repo/shared/presentation/components/ui/spinner';
import { cn } from '@repo/shared/presentation/lib/utils';
import { ActivityIcon, RefreshCwIcon, ServerIcon } from 'lucide-react';

interface HealthStatusCardProps {
  status?: string;
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  lastChecked?: Date;
  className?: string;
}

export function HealthStatusCard({
  status,
  loading = false,
  error = null,
  onRefresh,
  lastChecked,
  className,
}: HealthStatusCardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className="size-5 text-muted-foreground" />
              Backend Status
            </CardTitle>
            <CardDescription>
              Current health status of the backend API
            </CardDescription>
          </div>
          {status && <HealthStatusBadge status={status} />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Spinner className="size-6" />
            <span className="ml-2 text-sm text-muted-foreground">
              Checking health...
            </span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && status && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ActivityIcon className="size-4" />
              <span>
                {status === 'ok' || status.toLowerCase() === 'healthy'
                  ? 'All systems operational'
                  : 'System experiencing issues'}
              </span>
            </div>

            {lastChecked && (
              <div className="text-xs text-muted-foreground">
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="w-full"
          >
            <RefreshCwIcon
              className={cn('size-4 mr-2', loading && 'animate-spin')}
            />
            Refresh Status
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

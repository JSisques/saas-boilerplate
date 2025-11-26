'use client';

import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
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
import {
  ActivityIcon,
  DatabaseIcon,
  GlobeIcon,
  RefreshCwIcon,
  ServerIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface HealthStatusPanelProps {
  status?: string;
  writeDatabaseStatus?: string;
  readDatabaseStatus?: string;
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  lastChecked?: Date;
}

export function HealthStatusPanel({
  status,
  writeDatabaseStatus,
  readDatabaseStatus,
  loading = false,
  error = null,
  onRefresh,
  lastChecked,
}: HealthStatusPanelProps) {
  const t = useTranslations('healthPage.organisms.healthStatusPanel');
  const tCommon = useTranslations('common');
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className="size-5 text-muted-foreground" />
              {t('environment')}
            </CardTitle>
            <CardDescription>{t('environmentDescription')}</CardDescription>
          </div>
          {status && <HealthStatusBadge status={status} />}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Spinner className="size-6" />
            <span className="ml-2 text-sm text-muted-foreground">
              {t('checkingHealth')}
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>{tCommon('error')}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {!loading && !error && (
          <div className="space-y-6">
            {/* Status Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ActivityIcon className="size-4" />
              <span>
                {status === HealthStatusEnum.OK
                  ? t('allSystemsOperational')
                  : t('systemExperiencingIssues')}
              </span>
            </div>

            {/* System Information Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GlobeIcon className="size-4 text-muted-foreground" />
                  {t('apiEndpoint')}
                </div>
                <div className="text-sm text-muted-foreground break-all">
                  {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <DatabaseIcon className="size-4 text-muted-foreground" />
                  {t('writeDatabase')}
                </div>
                <div className="flex items-center gap-2">
                  {writeDatabaseStatus ? (
                    <>
                      <div
                        className={cn(
                          'size-2 rounded-full',
                          writeDatabaseStatus.toLowerCase() === 'ok'
                            ? 'bg-green-500'
                            : 'bg-red-500',
                        )}
                      />
                      <HealthStatusBadge
                        status={writeDatabaseStatus}
                        className="text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <div className="size-2 rounded-full bg-gray-400" />
                      <span className="text-sm text-muted-foreground">
                        {tCommon('unknown')}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <DatabaseIcon className="size-4 text-muted-foreground" />
                  {t('readDatabase')}
                </div>
                <div className="flex items-center gap-2">
                  {readDatabaseStatus ? (
                    <>
                      <div
                        className={cn(
                          'size-2 rounded-full',
                          readDatabaseStatus.toLowerCase() === 'ok'
                            ? 'bg-green-500'
                            : 'bg-red-500',
                        )}
                      />
                      <HealthStatusBadge
                        status={readDatabaseStatus}
                        className="text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <div className="size-2 rounded-full bg-gray-400" />
                      <span className="text-sm text-muted-foreground">
                        {tCommon('unknown')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Last Checked & Refresh */}
            <div className="flex items-center justify-between pt-4 border-t">
              {lastChecked && (
                <div className="text-xs text-muted-foreground">
                  {t('lastChecked')} {lastChecked.toLocaleTimeString()}
                </div>
              )}
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={loading}
                >
                  <RefreshCwIcon
                    className={cn('size-4 mr-2', loading && 'animate-spin')}
                  />
                  {t('refreshStatus')}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

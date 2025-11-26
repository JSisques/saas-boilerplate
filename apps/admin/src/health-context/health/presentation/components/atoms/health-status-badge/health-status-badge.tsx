'use client';

import { Badge } from '@repo/shared/presentation/components/ui/badge';
import { cn } from '@repo/shared/presentation/lib/utils';
import { AlertCircleIcon, CheckCircle2Icon, XCircleIcon } from 'lucide-react';

interface HealthStatusBadgeProps {
  status: string;
  className?: string;
}

export function HealthStatusBadge({
  status,
  className,
}: HealthStatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const getStatusConfig = () => {
    switch (normalizedStatus) {
      case 'ok':
      case 'healthy':
      case 'up':
        return {
          variant: 'default' as const,
          icon: CheckCircle2Icon,
          label: 'Healthy',
          className:
            'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        };
      case 'error':
      case 'down':
      case 'unhealthy':
        return {
          variant: 'destructive' as const,
          icon: XCircleIcon,
          label: 'Unhealthy',
          className:
            'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
        };
      default:
        return {
          variant: 'outline' as const,
          icon: AlertCircleIcon,
          label: status,
          className:
            'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1',
        config.className,
        className,
      )}
    >
      <Icon className="size-3.5" />
      <span className="font-medium">{config.label}</span>
    </Badge>
  );
}

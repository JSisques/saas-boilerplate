import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public Decorator
 * Marks routes as public (bypasses authentication)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

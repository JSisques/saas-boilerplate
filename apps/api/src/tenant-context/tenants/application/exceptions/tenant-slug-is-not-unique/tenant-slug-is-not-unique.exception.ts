import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class TenantSlugIsNotUniqueException extends BaseApplicationException {
  constructor(slug: string) {
    super(`Tenant slug ${slug} is already taken`);
  }
}

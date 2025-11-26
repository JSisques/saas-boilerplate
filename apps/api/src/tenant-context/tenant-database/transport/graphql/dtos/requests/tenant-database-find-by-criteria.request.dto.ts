import { BaseFindByCriteriaInput } from '@/shared/transport/graphql/dtos/requests/base-find-by-criteria/base-find-by-criteria.input';
import { InputType } from '@nestjs/graphql';

@InputType('TenantDatabaseFindByCriteriaRequestDto')
export class TenantDatabaseFindByCriteriaRequestDto extends BaseFindByCriteriaInput {}

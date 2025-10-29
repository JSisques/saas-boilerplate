import { BaseFindByCriteriaInput } from '@/shared/transport/graphql/dtos/requests/base-find-by-criteria.input';
import { InputType } from '@nestjs/graphql';

@InputType('TenantMemberFindByCriteriaRequestDto')
export class TenantMemberFindByCriteriaRequestDto extends BaseFindByCriteriaInput {}

import { BaseFindByCriteriaInput } from '@/shared/transport/graphql/dtos/requests/base-find-by-criteria.input';
import { InputType } from '@nestjs/graphql';

@InputType('AuditFindByCriteriaRequestDto')
export class AuditFindByCriteriaRequestDto extends BaseFindByCriteriaInput {}

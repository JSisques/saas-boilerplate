import { BaseFindByCriteriaInput } from '@/shared/transport/graphql/dtos/requests/base-find-by-criteria.input';
import { InputType } from '@nestjs/graphql';

@InputType('SubscriptionPlanFindByCriteriaRequestDto')
export class SubscriptionPlanFindByCriteriaRequestDto extends BaseFindByCriteriaInput {}

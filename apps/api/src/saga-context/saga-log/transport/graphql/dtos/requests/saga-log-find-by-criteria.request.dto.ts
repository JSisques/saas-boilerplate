import { BaseFindByCriteriaInput } from '@/shared/transport/graphql/dtos/requests/base-find-by-criteria/base-find-by-criteria.input';
import { InputType } from '@nestjs/graphql';

@InputType('SagaLogFindByCriteriaRequestDto')
export class SagaLogFindByCriteriaRequestDto extends BaseFindByCriteriaInput {}

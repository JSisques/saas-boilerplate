import { BaseFindByCriteriaInput } from '@/shared/transport/graphql/dtos/requests/base-find-by-criteria/base-find-by-criteria.input';
import { InputType } from '@nestjs/graphql';

@InputType('PromptFindByCriteriaRequestDto')
export class PromptFindByCriteriaRequestDto extends BaseFindByCriteriaInput {}

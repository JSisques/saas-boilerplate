import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class PromptStatusValueObject extends EnumValueObject<
  typeof PromptStatusEnum
> {
  protected get enumObject(): typeof PromptStatusEnum {
    return PromptStatusEnum;
  }
}

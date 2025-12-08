import { PromptIsActiveValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-is-active/prompt-is-active.vo';

describe('PromptIsActiveValueObject', () => {
  describe('constructor', () => {
    it('should create a valid PromptIsActiveValueObject with true', () => {
      const isActive = new PromptIsActiveValueObject(true);
      expect(isActive.value).toBe(true);
    });

    it('should create a valid PromptIsActiveValueObject with false', () => {
      const isActive = new PromptIsActiveValueObject(false);
      expect(isActive.value).toBe(false);
    });
  });
});

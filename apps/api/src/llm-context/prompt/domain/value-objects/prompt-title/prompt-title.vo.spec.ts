import { PromptTitleValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-title/prompt-title.vo';

describe('PromptTitleValueObject', () => {
  describe('constructor', () => {
    it('should create a valid PromptTitleValueObject', () => {
      const title = new PromptTitleValueObject('Test Title');
      expect(title.value).toBe('Test Title');
    });

    it('should create title with special characters', () => {
      const title = new PromptTitleValueObject('Test Title: Version 1.0');
      expect(title.value).toBe('Test Title: Version 1.0');
    });
  });
});

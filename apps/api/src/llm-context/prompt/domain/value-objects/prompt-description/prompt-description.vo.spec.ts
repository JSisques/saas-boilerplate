import { PromptDescriptionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-description/prompt-description.vo';

describe('PromptDescriptionValueObject', () => {
  describe('constructor', () => {
    it('should create a valid PromptDescriptionValueObject', () => {
      const description = new PromptDescriptionValueObject('Test description');
      expect(description.value).toBe('Test description');
    });

    it('should create description with long text', () => {
      const longDescription =
        'This is a very long description that contains multiple sentences and paragraphs.';
      const description = new PromptDescriptionValueObject(longDescription);
      expect(description.value).toBe(longDescription);
    });
  });
});

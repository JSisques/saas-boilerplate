import { PromptSlugValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-slug/prompt-slug.vo';

describe('PromptSlugValueObject', () => {
  describe('constructor', () => {
    it('should create a valid PromptSlugValueObject', () => {
      const slug = new PromptSlugValueObject('test-prompt');
      expect(slug.value).toBe('test-prompt');
    });

    it('should create slug with hyphens', () => {
      const slug = new PromptSlugValueObject('my-test-prompt');
      expect(slug.value).toBe('my-test-prompt');
    });

    it('should create slug with numbers', () => {
      const slug = new PromptSlugValueObject('prompt-123');
      expect(slug.value).toBe('prompt-123');
    });
  });
});

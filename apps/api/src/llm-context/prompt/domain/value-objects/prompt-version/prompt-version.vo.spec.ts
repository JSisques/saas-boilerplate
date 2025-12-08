import { PromptVersionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-version/prompt-version.vo';

describe('PromptVersionValueObject', () => {
  describe('constructor', () => {
    it('should create a valid PromptVersionValueObject with number', () => {
      const version = new PromptVersionValueObject(1);
      expect(version.value).toBe(1);
    });

    it('should create a valid PromptVersionValueObject with string', () => {
      const version = new PromptVersionValueObject('1');
      expect(version.value).toBe(1);
    });

    it('should throw error for version less than 1', () => {
      expect(() => {
        new PromptVersionValueObject(0);
      }).toThrow();
    });

    it('should throw error for negative version', () => {
      expect(() => {
        new PromptVersionValueObject(-1);
      }).toThrow();
    });

    it('should throw error for decimal version', () => {
      expect(() => {
        new PromptVersionValueObject(1.5);
      }).toThrow();
    });

    it('should accept version 1', () => {
      const version = new PromptVersionValueObject(1);
      expect(version.value).toBe(1);
    });

    it('should accept large version numbers', () => {
      const version = new PromptVersionValueObject(100);
      expect(version.value).toBe(100);
    });
  });
});

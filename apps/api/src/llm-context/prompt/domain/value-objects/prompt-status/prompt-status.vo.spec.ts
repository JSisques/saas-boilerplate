import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { PromptStatusValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-status/prompt-status.vo';

describe('PromptStatusValueObject', () => {
  describe('constructor', () => {
    it('should create a valid PromptStatusValueObject with ACTIVE', () => {
      const status = new PromptStatusValueObject(PromptStatusEnum.ACTIVE);
      expect(status.value).toBe(PromptStatusEnum.ACTIVE);
    });

    it('should create a valid PromptStatusValueObject with DRAFT', () => {
      const status = new PromptStatusValueObject(PromptStatusEnum.DRAFT);
      expect(status.value).toBe(PromptStatusEnum.DRAFT);
    });

    it('should create a valid PromptStatusValueObject with ARCHIVED', () => {
      const status = new PromptStatusValueObject(PromptStatusEnum.ARCHIVED);
      expect(status.value).toBe(PromptStatusEnum.ARCHIVED);
    });

    it('should create a valid PromptStatusValueObject with DEPRECATED', () => {
      const status = new PromptStatusValueObject(PromptStatusEnum.DEPRECATED);
      expect(status.value).toBe(PromptStatusEnum.DEPRECATED);
    });

    it('should throw error for invalid status', () => {
      expect(() => {
        new PromptStatusValueObject('INVALID_STATUS' as PromptStatusEnum);
      }).toThrow();
    });
  });

  describe('all status values', () => {
    it('should accept all valid enum values', () => {
      const statuses = [
        PromptStatusEnum.ACTIVE,
        PromptStatusEnum.DRAFT,
        PromptStatusEnum.ARCHIVED,
        PromptStatusEnum.DEPRECATED,
      ];

      statuses.forEach((statusValue) => {
        const status = new PromptStatusValueObject(statusValue);
        expect(status.value).toBe(statusValue);
      });
    });
  });
});

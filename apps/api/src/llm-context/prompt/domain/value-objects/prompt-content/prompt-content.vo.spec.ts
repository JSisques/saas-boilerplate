import { PromptContentValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-content/prompt-content.vo';

describe('PromptContentValueObject', () => {
  describe('constructor', () => {
    it('should create a valid PromptContentValueObject', () => {
      const content = new PromptContentValueObject('Test content');
      expect(content.value).toBe('Test content');
    });

    it('should throw error for empty content', () => {
      expect(() => {
        new PromptContentValueObject('');
      }).toThrow();
    });

    it('should throw error for content exceeding max length', () => {
      const longContent = 'a'.repeat(10001);
      expect(() => {
        new PromptContentValueObject(longContent);
      }).toThrow();
    });

    it('should preserve formatting (no trim)', () => {
      const contentWithSpaces = '  Test content  ';
      const content = new PromptContentValueObject(contentWithSpaces);
      expect(content.value).toBe('  Test content  ');
    });
  });

  describe('extractVariables', () => {
    it('should extract single variable', () => {
      const content = new PromptContentValueObject('Hello {{name}}');
      const variables = content.extractVariables();
      expect(variables).toEqual(['name']);
    });

    it('should extract multiple variables', () => {
      const content = new PromptContentValueObject(
        'Hello {{name}}, you are {{age}} years old',
      );
      const variables = content.extractVariables();
      expect(variables).toEqual(['name', 'age']);
    });

    it('should extract unique variables only', () => {
      const content = new PromptContentValueObject(
        'Hello {{name}}, {{name}} again',
      );
      const variables = content.extractVariables();
      expect(variables).toEqual(['name']);
    });

    it('should return empty array when no variables', () => {
      const content = new PromptContentValueObject('Hello world');
      const variables = content.extractVariables();
      expect(variables).toEqual([]);
    });

    it('should handle variables with underscores', () => {
      const content = new PromptContentValueObject('Hello {{user_name}}');
      const variables = content.extractVariables();
      expect(variables).toEqual(['user_name']);
    });
  });

  describe('replaceVariables', () => {
    it('should replace single variable', () => {
      const content = new PromptContentValueObject('Hello {{name}}');
      const result = content.replaceVariables({ name: 'John' });
      expect(result).toBe('Hello John');
    });

    it('should replace multiple variables', () => {
      const content = new PromptContentValueObject(
        'Hello {{name}}, you are {{age}} years old',
      );
      const result = content.replaceVariables({
        name: 'John',
        age: '30',
      });
      expect(result).toBe('Hello John, you are 30 years old');
    });

    it('should replace all occurrences of same variable', () => {
      const content = new PromptContentValueObject(
        'Hello {{name}}, {{name}} again',
      );
      const result = content.replaceVariables({ name: 'John' });
      expect(result).toBe('Hello John, John again');
    });

    it('should leave unreplaced variables as is', () => {
      const content = new PromptContentValueObject('Hello {{name}}');
      const result = content.replaceVariables({});
      expect(result).toBe('Hello {{name}}');
    });

    it('should handle empty variables object', () => {
      const content = new PromptContentValueObject('Hello {{name}}');
      const result = content.replaceVariables({});
      expect(result).toBe('Hello {{name}}');
    });
  });

  describe('validateVariables', () => {
    it('should return true when all variables are provided', () => {
      const content = new PromptContentValueObject(
        'Hello {{name}}, you are {{age}} years old',
      );
      const isValid = content.validateVariables(['name', 'age']);
      expect(isValid).toBe(true);
    });

    it('should return false when some variables are missing', () => {
      const content = new PromptContentValueObject(
        'Hello {{name}}, you are {{age}} years old',
      );
      const isValid = content.validateVariables(['name']);
      expect(isValid).toBe(false);
    });

    it('should return true when extra variables are provided', () => {
      const content = new PromptContentValueObject('Hello {{name}}');
      const isValid = content.validateVariables(['name', 'age', 'city']);
      expect(isValid).toBe(true);
    });

    it('should return true when no variables in content', () => {
      const content = new PromptContentValueObject('Hello world');
      const isValid = content.validateVariables([]);
      expect(isValid).toBe(true);
    });

    it('should return false when no variables provided but content has variables', () => {
      const content = new PromptContentValueObject('Hello {{name}}');
      const isValid = content.validateVariables([]);
      expect(isValid).toBe(false);
    });
  });
});

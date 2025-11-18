import { SlugValueObject } from '@/shared/domain/value-objects/slug/slug.vo';
import { InvalidStringException } from '@/shared/domain/exceptions/value-objects/invalid-string/invalid-string.exception';

describe('SlugValueObject', () => {
  describe('constructor', () => {
    it('should create a slug value object with valid slug', () => {
      const slug = new SlugValueObject('test-slug');

      expect(slug.value).toBe('test-slug');
    });

    it('should generate slug from string when generateFromString is true', () => {
      const slug = new SlugValueObject('Test String', {
        generateFromString: true,
      });

      expect(slug.value).toBe('test-string');
    });

    it('should throw InvalidStringException for invalid slug format', () => {
      expect(() => new SlugValueObject('Invalid Slug!')).toThrow(
        InvalidStringException,
      );
    });

    it('should throw InvalidStringException for slug starting with hyphen', () => {
      expect(() => new SlugValueObject('-test-slug')).toThrow(
        InvalidStringException,
      );
    });

    it('should throw InvalidStringException for slug ending with hyphen', () => {
      expect(() => new SlugValueObject('test-slug-')).toThrow(
        InvalidStringException,
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal slugs', () => {
      const slug1 = new SlugValueObject('test-slug');
      const slug2 = new SlugValueObject('test-slug');

      expect(slug1.equals(slug2)).toBe(true);
    });

    it('should return false for different slugs', () => {
      const slug1 = new SlugValueObject('test-slug-1');
      const slug2 = new SlugValueObject('test-slug-2');

      expect(slug1.equals(slug2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should generate slug from string', () => {
      const slug = SlugValueObject.generateSlug('Test String Here');

      expect(slug).toBe('test-string-here');
    });

    it('should check if valid slug format', () => {
      expect(new SlugValueObject('test-slug').isValidSlug()).toBe(true);
    });

    it('should get word count', () => {
      const slug = new SlugValueObject('test-slug-here');

      expect(slug.getWordCount()).toBe(3);
    });

    it('should add suffix to slug', () => {
      const slug = new SlugValueObject('test-slug');
      const newSlug = slug.addSuffix('suffix');

      expect(newSlug.value).toBe('test-slug-suffix');
    });

    it('should add prefix to slug', () => {
      const slug = new SlugValueObject('test-slug');
      const newSlug = slug.addPrefix('prefix');

      expect(newSlug.value).toBe('prefix-test-slug');
    });
  });
});

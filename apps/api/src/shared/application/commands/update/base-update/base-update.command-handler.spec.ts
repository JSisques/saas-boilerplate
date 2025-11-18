import { BaseUpdateCommandHandler } from './base-update.command-handler';

// Create a concrete implementation for testing
interface TestCommand {
  id: string;
  name?: string;
  email?: string;
  age?: number;
  status?: string;
}

interface TestUpdateDto {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
  status?: string;
}

class TestUpdateCommandHandler extends BaseUpdateCommandHandler<
  TestCommand,
  TestUpdateDto
> {
  // Expose protected methods for testing
  public extractUpdateDataPublic(
    command: TestCommand,
    excludeFields: string[] = [],
  ): TestUpdateDto {
    return this.extractUpdateData(command, excludeFields);
  }

  public extractUpdateDataWithTransformPublic(
    command: TestCommand,
    transformer?: (data: Partial<TestUpdateDto>) => Partial<TestUpdateDto>,
    excludeFields: string[] = [],
  ): TestUpdateDto {
    return this.extractUpdateDataWithTransform(
      command,
      transformer,
      excludeFields,
    );
  }
}

describe('BaseUpdateCommandHandler', () => {
  let handler: TestUpdateCommandHandler;

  beforeEach(() => {
    handler = new TestUpdateCommandHandler();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should have a logger', () => {
    expect(handler['logger']).toBeDefined();
  });

  describe('extractUpdateData', () => {
    it('should extract update data excluding undefined values', () => {
      const command: TestCommand = {
        id: '123',
        name: 'John',
        email: undefined,
        age: 30,
        status: 'active',
      };

      const result = handler.extractUpdateDataPublic(command);

      expect(result).toEqual({
        id: '123',
        name: 'John',
        age: 30,
        status: 'active',
      });
      expect(result.email).toBeUndefined();
    });

    it('should exclude specified fields', () => {
      const command: TestCommand = {
        id: '123',
        name: 'John',
        email: 'john@example.com',
        age: 30,
      };

      const result = handler.extractUpdateDataPublic(command, ['id', 'age']);

      expect(result).toEqual({
        name: 'John',
        email: 'john@example.com',
      });
      expect(result.id).toBeUndefined();
      expect(result.age).toBeUndefined();
    });

    it('should handle empty command', () => {
      const command: TestCommand = {
        id: '123',
      };

      const result = handler.extractUpdateDataPublic(command);

      expect(result).toEqual({
        id: '123',
      });
    });

    it('should handle command with all undefined values', () => {
      const command: TestCommand = {
        id: '123',
        name: undefined,
        email: undefined,
        age: undefined,
      };

      const result = handler.extractUpdateDataPublic(command);

      expect(result).toEqual({
        id: '123',
      });
    });

    it('should handle command with all defined values', () => {
      const command: TestCommand = {
        id: '123',
        name: 'John',
        email: 'john@example.com',
        age: 30,
        status: 'active',
      };

      const result = handler.extractUpdateDataPublic(command);

      expect(result).toEqual({
        id: '123',
        name: 'John',
        email: 'john@example.com',
        age: 30,
        status: 'active',
      });
    });

    it('should exclude multiple fields', () => {
      const command: TestCommand = {
        id: '123',
        name: 'John',
        email: 'john@example.com',
        age: 30,
        status: 'active',
      };

      const result = handler.extractUpdateDataPublic(command, [
        'id',
        'email',
        'status',
      ]);

      expect(result).toEqual({
        name: 'John',
        age: 30,
      });
    });
  });

  describe('extractUpdateDataWithTransform', () => {
    it('should extract and transform data', () => {
      const command: TestCommand = {
        id: '123',
        name: 'John',
        email: 'john@example.com',
        age: 30,
      };

      const transformer = (data: Partial<TestUpdateDto>) => ({
        ...data,
        name: data.name?.toUpperCase(),
      });

      const result = handler.extractUpdateDataWithTransformPublic(
        command,
        transformer,
      );

      expect(result.name).toBe('JOHN');
      expect(result.email).toBe('john@example.com');
      expect(result.age).toBe(30);
    });

    it('should extract data without transformer', () => {
      const command: TestCommand = {
        id: '123',
        name: 'John',
        email: 'john@example.com',
      };

      const result = handler.extractUpdateDataWithTransformPublic(command);

      expect(result).toEqual({
        id: '123',
        name: 'John',
        email: 'john@example.com',
      });
    });

    it('should apply transformer and exclude fields', () => {
      const command: TestCommand = {
        id: '123',
        name: 'John',
        email: 'john@example.com',
        age: 30,
      };

      const transformer = (data: Partial<TestUpdateDto>) => ({
        ...data,
        name: data.name?.toUpperCase(),
      });

      const result = handler.extractUpdateDataWithTransformPublic(
        command,
        transformer,
        ['id', 'age'],
      );

      expect(result.name).toBe('JOHN');
      expect(result.email).toBe('john@example.com');
      expect(result.id).toBeUndefined();
      expect(result.age).toBeUndefined();
    });

    it('should handle complex transformation', () => {
      const command: TestCommand = {
        id: '123',
        name: 'John',
        email: 'john@example.com',
        age: 30,
      };

      const transformer = (data: Partial<TestUpdateDto>) => {
        const transformed = { ...data };
        if (transformed.email) {
          transformed.email = transformed.email.toLowerCase();
        }
        if (transformed.age) {
          transformed.age = (transformed.age as number) + 1;
        }
        return transformed;
      };

      const result = handler.extractUpdateDataWithTransformPublic(
        command,
        transformer,
        ['id'],
      );

      expect(result.name).toBe('John');
      expect(result.email).toBe('john@example.com');
      expect(result.age).toBe(31);
    });

    it('should handle empty transformer result', () => {
      const command: TestCommand = {
        id: '123',
        name: 'John',
      };

      const transformer = () => ({});

      const result = handler.extractUpdateDataWithTransformPublic(
        command,
        transformer,
      );

      expect(result).toEqual({});
    });
  });
});

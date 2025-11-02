import { InvalidJsonException } from '@/shared/domain/exceptions/value-objects/invalid-json.exception';

/**
 * JSON Value Object
 * This value object is responsible for encapsulating JSON data with validation.
 * It ensures that the JSON is valid and provides utility methods for manipulation.
 * @param value - The JSON object or string.
 * @param options - Validation options for the JSON.
 * @returns A new instance of the JsonValueObject.
 */
export class JsonValueObject {
  private readonly _value: Record<string, any>;

  constructor(
    value?: Record<string, any> | string,
    private readonly options: {
      allowEmpty?: boolean;
      maxDepth?: number;
      requiredKeys?: string[];
      allowedKeys?: string[];
      schema?: Record<string, any>;
    } = {},
  ) {
    this._value = this.processValue(value);
    this.validate();
  }

  public get value(): Record<string, any> {
    return this._value;
  }

  /**
   * Converts the JSON to a string
   * @param pretty - Whether to format with indentation
   * @returns The string representation of the JSON
   */
  public toString(pretty: boolean = false): string {
    return pretty
      ? JSON.stringify(this._value, null, 2)
      : JSON.stringify(this._value);
  }

  /**
   * Compares this JSON with another JsonValueObject for equality
   * @param other - Another JsonValueObject to compare with
   * @returns True if the JSONs are equal, false otherwise
   */
  public equals(other: JsonValueObject): boolean {
    return JSON.stringify(this._value) === JSON.stringify(other.value);
  }

  /**
   * Checks if the JSON is empty
   * @returns True if empty
   */
  public isEmpty(): boolean {
    return Object.keys(this._value).length === 0;
  }

  /**
   * Checks if the JSON is not empty
   * @returns True if not empty
   */
  public isNotEmpty(): boolean {
    return Object.keys(this._value).length > 0;
  }

  /**
   * Gets the number of keys in the JSON
   * @returns The number of keys
   */
  public size(): number {
    return Object.keys(this._value).length;
  }

  /**
   * Checks if a key exists in the JSON
   * @param key - The key to check
   * @returns True if the key exists
   */
  public hasKey(key: string): boolean {
    return key in this._value;
  }

  /**
   * Gets a value by key
   * @param key - The key to get
   * @returns The value or undefined
   */
  public get(key: string): any {
    return this._value[key];
  }

  /**
   * Gets a value by key with a default value
   * @param key - The key to get
   * @param defaultValue - The default value if key doesn't exist
   * @returns The value or default value
   */
  public getOrDefault(key: string, defaultValue: any): any {
    return this._value[key] ?? defaultValue;
  }

  /**
   * Gets all keys in the JSON
   * @returns Array of keys
   */
  public keys(): string[] {
    return Object.keys(this._value);
  }

  /**
   * Gets all values in the JSON
   * @returns Array of values
   */
  public values(): any[] {
    return Object.values(this._value);
  }

  /**
   * Gets all entries in the JSON
   * @returns Array of [key, value] pairs
   */
  public entries(): [string, any][] {
    return Object.entries(this._value);
  }

  /**
   * Merges another JSON object into this one
   * @param other - The JSON object to merge
   * @param deep - Whether to perform deep merge
   * @returns A new JsonValueObject with merged data
   */
  public merge(other: JsonValueObject, deep: boolean = false): JsonValueObject {
    if (deep) {
      const merged = this.deepMerge(this._value, other.value);
      return new JsonValueObject(merged, this.options);
    }
    return new JsonValueObject(
      { ...this._value, ...other.value },
      this.options,
    );
  }

  /**
   * Creates a new JSON object with only the specified keys
   * @param keys - The keys to include
   * @returns A new JsonValueObject with filtered keys
   */
  public pick(keys: string[]): JsonValueObject {
    const picked: Record<string, any> = {};
    keys.forEach((key) => {
      if (key in this._value) {
        picked[key] = this._value[key];
      }
    });
    return new JsonValueObject(picked, this.options);
  }

  /**
   * Creates a new JSON object without the specified keys
   * @param keys - The keys to exclude
   * @returns A new JsonValueObject without the specified keys
   */
  public omit(keys: string[]): JsonValueObject {
    const omitted: Record<string, any> = { ...this._value };
    keys.forEach((key) => {
      delete omitted[key];
    });
    return new JsonValueObject(omitted, this.options);
  }

  /**
   * Transforms the JSON object using a function
   * @param transformer - Function to transform each key-value pair
   * @returns A new JsonValueObject with transformed data
   */
  public transform(
    transformer: (key: string, value: any) => [string, any],
  ): JsonValueObject {
    const transformed: Record<string, any> = {};
    Object.entries(this._value).forEach(([key, value]) => {
      const [newKey, newValue] = transformer(key, value);
      transformed[newKey] = newValue;
    });
    return new JsonValueObject(transformed, this.options);
  }

  /**
   * Filters the JSON object based on a predicate
   * @param predicate - Function to test each key-value pair
   * @returns A new JsonValueObject with filtered data
   */
  public filter(
    predicate: (key: string, value: any) => boolean,
  ): JsonValueObject {
    const filtered: Record<string, any> = {};
    Object.entries(this._value).forEach(([key, value]) => {
      if (predicate(key, value)) {
        filtered[key] = value;
      }
    });
    return new JsonValueObject(filtered, this.options);
  }

  /**
   * Validates the JSON against a schema
   * @param schema - The schema to validate against
   * @returns True if valid, false otherwise
   */
  public validateSchema(schema: Record<string, any>): boolean {
    return this.validateAgainstSchema(this._value, schema);
  }

  /**
   * Gets a nested value using dot notation
   * @param path - The dot notation path (e.g., 'user.profile.name')
   * @returns The nested value or undefined
   */
  public getNested(path: string): any {
    return path.split('.').reduce((obj, key) => obj?.[key], this._value);
  }

  /**
   * Sets a nested value using dot notation
   * @param path - The dot notation path
   * @param value - The value to set
   * @returns A new JsonValueObject with the nested value set
   */
  public setNested(path: string, value: any): JsonValueObject {
    const newValue = { ...this._value };
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((obj, key) => {
      if (!(key in obj)) {
        obj[key] = {};
      }
      return obj[key];
    }, newValue);
    target[lastKey] = value;
    return new JsonValueObject(newValue, this.options);
  }

  /**
   * Clones the JSON object
   * @param deep - Whether to perform deep clone
   * @returns A new JsonValueObject with cloned data
   */
  public clone(deep: boolean = false): JsonValueObject {
    if (deep) {
      return new JsonValueObject(
        JSON.parse(JSON.stringify(this._value)),
        this.options,
      );
    }
    return new JsonValueObject({ ...this._value }, this.options);
  }

  private processValue(
    value: Record<string, any> | string | undefined,
  ): Record<string, any> {
    if (value === undefined || value === null) {
      return {};
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new InvalidJsonException(
            'JSON must be an object, not an array or primitive',
          );
        }
        return parsed;
      } catch {
        throw new InvalidJsonException('Invalid JSON string format');
      }
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new InvalidJsonException(
        'Value must be an object, not an array or primitive',
      );
    }

    return value;
  }

  private validate(): void {
    this.checkEmpty();
    this.checkDepth();
    this.checkRequiredKeys();
    this.checkAllowedKeys();
    this.checkSchema();
  }

  private checkEmpty(): void {
    if (this.options.allowEmpty === false && this.isEmpty()) {
      throw new InvalidJsonException('JSON cannot be empty');
    }
  }

  private checkDepth(): void {
    if (this.options.maxDepth !== undefined) {
      const depth = this.getDepth(this._value);
      if (depth > this.options.maxDepth) {
        throw new InvalidJsonException(
          `JSON depth (${depth}) exceeds maximum allowed depth (${this.options.maxDepth})`,
        );
      }
    }
  }

  private checkRequiredKeys(): void {
    if (this.options.requiredKeys) {
      const missingKeys = this.options.requiredKeys.filter(
        (key) => !(key in this._value),
      );
      if (missingKeys.length > 0) {
        throw new InvalidJsonException(
          `Missing required keys: ${missingKeys.join(', ')}`,
        );
      }
    }
  }

  private checkAllowedKeys(): void {
    if (this.options.allowedKeys) {
      const invalidKeys = Object.keys(this._value).filter(
        (key) => !this.options.allowedKeys!.includes(key),
      );
      if (invalidKeys.length > 0) {
        throw new InvalidJsonException(
          `Invalid keys: ${invalidKeys.join(', ')}. Allowed keys: ${this.options.allowedKeys.join(', ')}`,
        );
      }
    }
  }

  private checkSchema(): void {
    if (
      this.options.schema &&
      !this.validateAgainstSchema(this._value, this.options.schema)
    ) {
      throw new InvalidJsonException('JSON does not match required schema');
    }
  }

  private getDepth(obj: any, currentDepth: number = 0): number {
    if (typeof obj !== 'object' || obj === null) {
      return currentDepth;
    }

    let maxDepth = currentDepth;
    Object.values(obj).forEach((value) => {
      const depth = this.getDepth(value, currentDepth + 1);
      maxDepth = Math.max(maxDepth, depth);
    });

    return maxDepth;
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };

    Object.keys(source).forEach((key) => {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    });

    return result;
  }

  private validateAgainstSchema(obj: any, schema: any): boolean {
    // Simple schema validation - can be extended for more complex schemas
    if (typeof schema !== 'object' || schema === null) {
      return false;
    }

    for (const [key, expectedType] of Object.entries(schema)) {
      if (!(key in obj)) {
        return false;
      }

      const actualType = typeof obj[key];
      if (expectedType === 'array' && !Array.isArray(obj[key])) {
        return false;
      }
      if (expectedType !== 'array' && actualType !== expectedType) {
        return false;
      }
    }

    return true;
  }
}

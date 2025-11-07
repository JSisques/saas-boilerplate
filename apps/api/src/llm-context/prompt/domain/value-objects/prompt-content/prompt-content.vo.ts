import { StringValueObject } from '@/shared/domain/value-objects/string.vo';

/**
 * PromptContentValueObject represents a prompt's content in the domain.
 * It extends the StringValueObject with validation for prompt content.
 * The content can contain variables in the format {{variableName}}.
 */
export class PromptContentValueObject extends StringValueObject {
  constructor(value: string) {
    super(value, {
      minLength: 1,
      maxLength: 10000,
      allowEmpty: false,
      trim: false, // Don't trim to preserve formatting
    });
  }

  /**
   * Extracts variable names from the prompt content
   * Variables are in the format {{variableName}}
   * @returns Array of unique variable names found in the content
   */
  public extractVariables(): string[] {
    const variablePattern = /\{\{(\w+)\}\}/g;
    const variables = new Set<string>();
    let match;

    while ((match = variablePattern.exec(this.value)) !== null) {
      variables.add(match[1]);
    }

    return Array.from(variables);
  }

  /**
   * Replaces variables in the content with provided values
   * @param variables - Object with variable names as keys and values as values
   * @returns New string with replaced variables
   */
  public replaceVariables(variables: Record<string, string>): string {
    let content = this.value;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, value);
    }
    return content;
  }

  /**
   * Validates that all required variables are provided
   * @param providedVariables - Array of variable names that are provided
   * @returns True if all variables in the content are provided
   */
  public validateVariables(providedVariables: string[]): boolean {
    const requiredVariables = this.extractVariables();
    return requiredVariables.every((variable) =>
      providedVariables.includes(variable),
    );
  }
}

/**
 * Base configuration options shared by all LLM providers.
 * @property apiKey - The API key used for authenticating requests to the provider.
 * @property model - The model name or identifier to use for generation.
 * @property temperature - (Optional) Sampling temperature for controlling randomness.
 * @property systemPrompt - (Optional) System prompt to steer the model's behavior.
 * @property [key: string] - (Optional) Additional provider-specific options.
 */
export interface LlmProviderConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  systemPrompt?: string;
  [key: string]: any;
}

/**
 * Interface that all LLM provider services must implement.
 */
export interface LlmProvider {
  /**
   * Generates text using the provider's API.
   * @param prompt The user prompt to generate from.
   * @param options Provider-specific configuration options.
   * @returns A promise that resolves to the generated text.
   */
  generateText(prompt: string, options?: any): Promise<string>;
}

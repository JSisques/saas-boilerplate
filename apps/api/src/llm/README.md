# LLM Module

This module provides a flexible and extensible architecture for managing multiple Large Language Model (LLM) providers (OpenAI, Gemini, DeepSeek, Groq, Mixtral, etc.) in a unified way. It is designed to be easily configurable, support new providers in the future, and centralize all LLM-related logic in one place.

---

## Table of Contents

- [LLM Module](#llm-module)
  - [Table of Contents](#table-of-contents)
  - [Purpose](#purpose)
  - [Folder Structure](#folder-structure)
  - [Supported Providers](#supported-providers)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
    - [Example `.env`](#example-env)
  - [Common Options](#common-options)
  - [How to Use](#how-to-use)
    - [Injecting the Service](#injecting-the-service)
    - [Generating Text](#generating-text)
  - [How to Add a New Provider](#how-to-add-a-new-provider)
  - [Best Practices](#best-practices)
  - [Example: Adding a New Provider](#example-adding-a-new-provider)
  - [Questions?](#questions)

---

## Purpose

This module abstracts the integration with different LLM providers, allowing you to:

- Switch providers via environment variables without code changes.
- Pass common and provider-specific options in a unified way.
- Easily add support for new LLM APIs.
- Centralize all LLM logic and configuration.

---

## Folder Structure

```
llm/
├── README.md
├── llm.module.ts
├── llm.service.ts
├── providers/
│   ├── llm-provider.interface.ts
│   ├── openai/
│   │   ├── openai.service.ts
│   │   └── openai.interface.ts
│   ├── gemini/
│   │   ├── gemini.service.ts
│   │   └── gemini.interface.ts
│   ├── deepseek/
│   │   ├── deepseek.service.ts
│   │   └── deepseek.interface.ts
│   ├── groq/
│   │   ├── groq.service.ts
│   │   └── groq.interface.ts
│   └── mixtral/
│       ├── mixtral.service.ts
│       └── mixtral.interface.ts
```

---

## Supported Providers

- **OpenAI** (`OPENAI`)
- **Gemini** (`GEMINI`)
- **DeepSeek** (`DEEPSEEK`)
- **Groq** (`GROQ`)
- **Mixtral** (`MIXTRAL`)

You can select the active provider via the `LLM_PROVIDER` environment variable.

---

## Configuration

### Environment Variables

Each provider supports the following environment variables:

- `LLM_PROVIDER` — Selects the active provider (`OPENAI`, `GEMINI`, `DEEPSEEK`, `GROQ`, `MIXTRAL`).
- `<PROVIDER>_API_KEY` — API key for the provider (e.g., `OPENAI_API_KEY`).
- `<PROVIDER>_DEFAULT_MODEL` — Default model name (e.g., `OPENAI_DEFAULT_MODEL`).
- `<PROVIDER>_DEFAULT_TEMPERATURE` — Default temperature (e.g., `OPENAI_DEFAULT_TEMPERATURE`).

If a value is not set in the environment, a hardcoded default will be used.

### Example `.env`

```
LLM_PROVIDER=OPENAI
OPENAI_API_KEY=sk-xxxx
OPENAI_DEFAULT_MODEL=gpt-4
OPENAI_DEFAULT_TEMPERATURE=0.7
```

---

## Common Options

All providers share the following options (see `LlmProviderConfig`):

- `apiKey` (string): API key for authentication.
- `model` (string): Model name or identifier.
- `temperature` (number, optional): Sampling temperature for randomness.
- `systemPrompt` (string, optional): System prompt to steer model behavior.
- `[key: string]: any` (optional): Additional provider-specific options.

You can pass these options when calling the service, or rely on environment/default values.

---

## How to Use

### Injecting the Service

Inject `LlmService` into your controller or service:

```typescript
import { LlmService } from 'path/to/llm/llm.service';

constructor(private readonly llmService: LlmService) {}
```

### Generating Text

Call `generateText` with a prompt and (optionally) options:

```typescript
const result = await this.llmService.generateText('What is the capital of France?', {
  systemPrompt: 'You are a helpful assistant.',
  temperature: 0.5,
});
```

- The provider, model, and API key will be resolved from options, environment, or defaults.
- You can override any option per request.

---

## How to Add a New Provider

1. **Create a folder** under `providers/` (e.g., `myllm/`).
2. **Define an interface** (e.g., `myllm.interface.ts`) extending `LlmProviderConfig` if you need extra options.
3. **Implement a service** (e.g., `myllm.service.ts`) that implements `LlmProvider` and handles merging options, logging, and API calls.
4. **Register the service** in `llm.module.ts` and update the provider factory to support your new provider.
5. **Document** any provider-specific environment variables or options.

---

## Best Practices

- Use environment variables for secrets and defaults.
- Always extend the base config for new providers.
- Keep provider logic isolated in its own service.
- Use the logger for observability and debugging.
- Add tests for new providers and edge cases.

---

## Example: Adding a New Provider

1. Create `providers/myllm/myllm.interface.ts`:

```typescript
import { LlmProviderConfig } from '../llm-provider.interface';
export interface MyLlmOptions extends LlmProviderConfig {
  // Add extra options if needed
}
```

2. Create `providers/myllm/myllm.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { LlmProvider } from '../llm-provider.interface';
import { MyLlmOptions } from './myllm.interface';

@Injectable()
export class MyLlmService implements LlmProvider {
  private readonly logger = new Logger(MyLlmService.name);
  private readonly defaultOptions: MyLlmOptions = {
    apiKey: process.env.MYLLM_API_KEY || '',
    model: process.env.MYLLM_DEFAULT_MODEL || 'myllm-base',
    temperature: process.env.MYLLM_DEFAULT_TEMPERATURE ? Number(process.env.MYLLM_DEFAULT_TEMPERATURE) : 0.7,
  };
  async generateText(prompt: string, options?: MyLlmOptions): Promise<string> {
    this.logger.log(`Generating text with MyLlm provider`);
    const mergedOptions = { ...this.defaultOptions, ...options };
    // ...
    return '...';
  }
}
```

3. Register and support in `llm.module.ts` as with other providers.

---

## Questions?

For any questions or suggestions, please contact the maintainers or open an issue in the repository.

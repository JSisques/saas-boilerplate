# Stripe Module

## Overview

This module provides a robust integration with the Stripe API for handling payments, subscriptions, and webhooks within a NestJS application. It encapsulates all Stripe-related business logic in a dedicated service, following best practices for modularity and maintainability.

## Architecture

The Stripe module is structured as follows:

- `stripe.service.ts`: Core business logic for all Stripe operations. This is the main entry point for interacting with Stripe from your backend code.
- `stripe.module.ts`: Exposes the service for dependency injection in other modules.
- `stripe.controller.ts`: (Optional) Handles Stripe webhooks. Not required for internal usage; API documentation is handled via Swagger.
- `stripe.controller.spec.ts` / `stripe.service.spec.ts`: Basic tests for controller and service.

### Service Design

The `StripeService` is designed to be injected into any other service or controller. It wraps the official Stripe SDK and provides methods for common payment and subscription flows, as well as webhook verification and handling.

#### Initialization

The service is initialized with the Stripe API key and version, loaded from environment variables using NestJS `ConfigService`.

## Service Methods (Technical Details)

- `createCustomer(email: string, paymentMethodId: string)`
  - Creates a new Stripe customer and sets the default payment method.
  - Returns the Stripe Customer object.
- `createSubscription(customerId: string, priceId: string)`
  - Creates a subscription for a customer with a specific price.
  - Returns the Stripe Subscription object, with expanded payment intent for client-side confirmation.
- `getSubscription(subscriptionId: string)`
  - Retrieves a subscription by its ID.
- `cancelSubscription(subscriptionId: string)`
  - Cancels a subscription immediately.
- `createPaymentIntent(amount: number, currency: string)`
  - Creates a one-time payment intent for the specified amount and currency.
- `verifyWebhookSignature(signature: string, payload: any, secret: string)`
  - Verifies the authenticity of incoming Stripe webhook events using the Stripe SDK.
- `handleWebhook(event: Stripe.Event)`
  - Processes Stripe webhook events. Handles subscription lifecycle events, invoice payments, and payment intents. Logs all relevant actions for traceability.

## Advanced Integration Example

To use the Stripe service in your own modules:

```typescript
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class BillingService {
  constructor(private readonly stripeService: StripeService) {}

  async onboardUser(email: string, paymentMethodId: string, priceId: string) {
    const customer = await this.stripeService.createCustomer(email, paymentMethodId);
    const subscription = await this.stripeService.createSubscription(customer.id, priceId);
    return { customer, subscription };
  }
}
```

## Environment Variables

- `STRIPE_API_KEY`: Your Stripe secret API key.
- `STRIPE_WEBHOOK_SECRET`: The secret used to verify Stripe webhook signatures.

## Testing

Basic tests are provided to ensure the service and controller are defined. For production, extend these tests to mock Stripe SDK calls and cover all business logic, including error handling and edge cases.

## Security & Best Practices

- Never expose your Stripe API keys or webhook secrets in client-side code.
- Always verify webhook signatures before processing events.
- Log all critical Stripe events for auditability.
- Use dependency injection to mock StripeService in your own tests.

## Extensibility

- To add new payment flows or handle additional webhook events, extend the `StripeService` with new methods or expand the `handleWebhook` switch statement.
- Keep business logic in the service layer; controllers should only handle HTTP transport concerns.

// src/stripe/stripe.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private logger: Logger;
  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_API_KEY'), {
      apiVersion: '2025-03-31.basil',
    });
    this.logger = new Logger(StripeService.name);
  }

  /**
   * Creates a new Stripe customer with the provided email and payment method
   * @param email - Customer's email address
   * @param paymentMethodId - ID of the payment method to be set as default
   * @returns Promise that resolves to the created Stripe Customer object
   */
  async createCustomer(email: string, paymentMethodId: string) {
    const customer = await this.stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    return customer;
  }

  /**
   * Creates a new subscription for a customer with the specified price
   * @param customerId - ID of the Stripe customer
   * @param priceId - ID of the subscription price to apply
   * @returns Promise that resolves to the created Stripe Subscription object
   */
  async createSubscription(customerId: string, priceId: string) {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
  }

  /**
   * Retrieves a customer's subscription details
   * @param subscriptionId - ID of the subscription to retrieve
   */
  async getSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Cancels a customer's subscription
   * @param subscriptionId - ID of the subscription to cancel
   */
  async cancelSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.cancel(subscriptionId);
  }

  /**
   * Creates a payment intent for a one-time payment
   * @param amount - Amount in cents
   * @param currency - Currency code (e.g., 'usd')
   */
  async createPaymentIntent(amount: number, currency: string) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency,
    });
  }

  /**
   * Verifies the signature of incoming webhook events
   */
  verifyWebhookSignature(signature: string, payload: any, secret: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }

  /**
   * Handles incoming Stripe webhook events
   * @param event - The Stripe webhook event object
   */
  async handleWebhook(event: Stripe.Event) {
    this.logger.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object as Stripe.Subscription;
        this.logger.log(`New subscription created: ${subscriptionCreated.id}`);
        break;

      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        this.logger.log(`Subscription updated: ${subscriptionUpdated.id}`);
        break;

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        this.logger.log(`Subscription cancelled: ${subscriptionDeleted.id}`);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        this.logger.log(`Payment succeeded for invoice: ${invoice.id}`);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        this.logger.log(`Payment failed for invoice: ${failedInvoice.id}`);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        this.logger.log(`Payment intent succeeded: ${paymentIntent.id}`);
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        this.logger.log(`Payment intent failed: ${failedPaymentIntent.id}`);
        break;

      default:
        this.logger.warn(`Unhandled webhook event type: ${event.type}`);
    }
  }
}

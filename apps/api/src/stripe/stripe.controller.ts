import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBody } from '@nestjs/swagger';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  private readonly logger;
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(StripeController.name);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe signature for webhook verification',
    required: true,
  })
  @ApiBody({
    description: 'Stripe webhook event object',
    type: Object,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
    schema: {
      type: 'object',
      properties: {
        received: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook signature',
  })
  async handleWebhook(@Body() event: Stripe.Event, @Headers() headers: any) {
    const sig = headers['stripe-signature'];
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    let stripeEvent: Stripe.Event;
    try {
      stripeEvent = this.stripeService.verifyWebhookSignature(sig, event, webhookSecret);
    } catch (err) {
      console.log('Webhook signature verification failed');
      return;
    }

    await this.stripeService.handleWebhook(stripeEvent);
    return { received: true };
  }
}

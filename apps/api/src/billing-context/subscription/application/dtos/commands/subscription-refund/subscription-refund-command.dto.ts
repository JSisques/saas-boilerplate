/**
 * Data Transfer Object for refunding a subscription by id via command layer.
 *
 * @interface ISubscriptionRefundCommandDto
 * @property {string} id - The id of the subscription to refund.
 */
export interface ISubscriptionRefundCommandDto {
  id: string;
}

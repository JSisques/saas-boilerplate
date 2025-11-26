export const SUBSCRIPTION_PLAN_CREATE_MUTATION = `
      mutation SubscriptionPlanCreate($input: SubscriptionPlanCreateRequestDto!) {
        subscriptionPlanCreate(input: $input) {
          success
          message
          id
        }
      }
    `;

export const SUBSCRIPTION_PLAN_UPDATE_MUTATION = `
      mutation SubscriptionPlanUpdate($input: SubscriptionPlanUpdateRequestDto!) {
        subscriptionPlanUpdate(input: $input) {
          success
          message
          id
        }
      }
    `;

export const SUBSCRIPTION_PLAN_DELETE_MUTATION = `
      mutation SubscriptionPlanDelete($input: SubscriptionPlanDeleteRequestDto!) {
        subscriptionPlanDelete(input: $input) {
          success
          message
          id
        }
      }
    `;

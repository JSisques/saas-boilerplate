export const SUBSCRIPTION_PLAN_FIND_BY_CRITERIA_QUERY = `
      query SubscriptionPlanFindByCriteria($input: SubscriptionPlanFindByCriteriaRequestDto) {
        subscriptionPlanFindByCriteria(input: $input) {
          total
          page
          perPage
          totalPages
          items {
            id
            name
            slug
            type
            description
            priceMonthly
            priceYearly
            currency
            interval
            intervalCount
            trialPeriodDays
            isActive
            features
            limits
            stripePriceId
            createdAt
            updatedAt
          }
        }
      }
    `;
export const SUBSCRIPTION_PLAN_FIND_BY_ID_QUERY = `
      query SubscriptionPlanFindById($input: SubscriptionPlanFindByIdRequestDto!) {
        subscriptionPlanFindById(input: $input) {
          id
          name
          slug
          type
          description
          priceMonthly
          priceYearly
          currency
          interval
          intervalCount
          trialPeriodDays
          isActive
          features
          limits
          stripePriceId
          createdAt
          updatedAt
        }
      }
    `;

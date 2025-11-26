import { SubscriptionPlanFiltersEnum } from "@/billing-context/subscription-plan/domain/enum/subscription-plan-filters/user-filters.enum";
import { FilterField } from "@repo/shared/presentation/components/organisms/dynamic-filters";

export const useSubscriptionPlanFilterFields = (): FilterField[] => {
  return [
    {
      key: SubscriptionPlanFiltersEnum.ID,
      label: "ID",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.NAME,
      label: "Name",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.SLUG,
      label: "Slug",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.TYPE,
      label: "Type",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.DESCRIPTION,
      label: "Description",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.PRICE_MONTHLY,
      label: "Price Monthly",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.PRICE_YEARLY,
      label: "Price Yearly",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.CURRENCY,
      label: "Currency",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.INTERVAL,
      label: "Interval",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.IS_ACTIVE,
      label: "Is Active",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.INTERVAL_COUNT,
      label: "Interval Count",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.TRIAL_PERIOD_DAYS,
      label: "Trial Period Days",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.LIMITS,
      label: "Limits",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.STRIPE_PRICE_ID,
      label: "Stripe Price ID",
      type: "text",
    },
    {
      key: SubscriptionPlanFiltersEnum.FEATURES,
      label: "Features",
      type: "text",
    },
  ];
};

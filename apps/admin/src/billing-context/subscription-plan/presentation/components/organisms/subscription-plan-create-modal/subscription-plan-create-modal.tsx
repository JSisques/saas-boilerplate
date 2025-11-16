import { SubscriptionPlanCurrencyEnum } from "@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum";
import { SubscriptionPlanIntervalEnum } from "@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum";
import { SubscriptionPlanTypeEnum } from "@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum";
import { useSubscriptionPlanPageStore } from "@/billing-context/subscription-plan/presentation/stores/subscription-plan-page-store";
import { useSubscriptionPlans } from "@repo/sdk";
import GenericModal from "@repo/shared/presentation/components/molecules/generic-modal";
import { Input } from "@repo/shared/presentation/components/ui/input";
import { Label } from "@repo/shared/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/shared/presentation/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/shared/presentation/components/ui/tabs";
import { Textarea } from "@repo/shared/presentation/components/ui/textarea";

type SubscriptionPlanCreateModalProps = {
  onCreated?: () => void;
};

export const SubscriptionPlanCreateModal = ({
  onCreated,
}: SubscriptionPlanCreateModalProps) => {
  const { isAddModalOpen, setIsAddModalOpen } = useSubscriptionPlanPageStore();
  const { create } = useSubscriptionPlans();

  const handleCreate = async () => {
    await create.fetch({
      name: "Test 3",
      type: SubscriptionPlanTypeEnum.FREE,
      description: "Test",
      priceMonthly: 0,
      currency: SubscriptionPlanCurrencyEnum.USD,
      interval: SubscriptionPlanIntervalEnum.MONTHLY,
      intervalCount: 1,
    });
    onCreated?.();
    setIsAddModalOpen(false);
  };

  return (
    <GenericModal
      key="add-subscription-plan"
      open={isAddModalOpen}
      onOpenChange={setIsAddModalOpen}
      contentClassName="sm:max-w-2xl"
      contentBodyClassName="max-h-[75vh] overflow-y-auto"
      title="Create subscription plan"
      description="Define the properties for the new subscription plan."
      primaryAction={{
        label: "Create",
        onClick: () => {
          handleCreate();
        },
      }}
      secondaryAction={{
        label: "Cancel",
        variant: "outline",
        onClick: () => setIsAddModalOpen(false),
      }}
    >
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input />
            </div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select defaultValue={SubscriptionPlanTypeEnum.FREE}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SubscriptionPlanTypeEnum.FREE}>
                    {SubscriptionPlanTypeEnum.FREE}
                  </SelectItem>
                  <SelectItem value={SubscriptionPlanTypeEnum.BASIC}>
                    {SubscriptionPlanTypeEnum.BASIC}
                  </SelectItem>
                  <SelectItem value={SubscriptionPlanTypeEnum.PRO}>
                    {SubscriptionPlanTypeEnum.PRO}
                  </SelectItem>
                  <SelectItem value={SubscriptionPlanTypeEnum.ENTERPRISE}>
                    {SubscriptionPlanTypeEnum.ENTERPRISE}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="mt-4">
          <div className="grid gap-4">
            <div className="flex gap-2 w-full">
              <div className="grid gap-2 basis-6/12">
                <Label>Price Monthly</Label>
                <Input type="number" />
              </div>
              <div className="grid gap-2 basis-3/12">
                <Label>Currency</Label>
                <Select defaultValue={SubscriptionPlanCurrencyEnum.USD}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SubscriptionPlanCurrencyEnum.USD}>
                      {SubscriptionPlanCurrencyEnum.USD}
                    </SelectItem>
                    <SelectItem value={SubscriptionPlanCurrencyEnum.EUR}>
                      {SubscriptionPlanCurrencyEnum.EUR}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 basis-3/12">
                <Label>Interval</Label>
                <Select defaultValue={SubscriptionPlanIntervalEnum.MONTHLY}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SubscriptionPlanIntervalEnum.MONTHLY}>
                      {SubscriptionPlanIntervalEnum.MONTHLY}
                    </SelectItem>
                    <SelectItem value={SubscriptionPlanIntervalEnum.YEARLY}>
                      {SubscriptionPlanIntervalEnum.YEARLY}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Interval Count</Label>
              <Input type="number" />
            </div>
            <div className="grid gap-2">
              <Label>Trial Period Days</Label>
              <Input type="number" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="limits" className="mt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Features</Label>
              <Input type="text" />
            </div>
            <div className="grid gap-2">
              <Label>Limits</Label>
              <Input type="text" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="mt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Stripe Price ID</Label>
              <Input type="text" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </GenericModal>
  );
};

export default SubscriptionPlanCreateModal;

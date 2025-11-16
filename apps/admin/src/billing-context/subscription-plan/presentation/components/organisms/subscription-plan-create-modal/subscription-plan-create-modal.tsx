import { useSubscriptionPlanPageStore } from "@/billing-context/subscription-plan/presentation/stores/subscription-plan-page-store";
import GenericModal from "@repo/shared/presentation/components/molecules/generic-modal";
import { Input } from "@repo/shared/presentation/components/ui/input";
import { Label } from "@repo/shared/presentation/components/ui/label";

export const SubscriptionPlanCreateModal = () => {
  const { isAddModalOpen, setIsAddModalOpen } = useSubscriptionPlanPageStore();

  const handleCreate = () => {
    // TODO: hook up create logic
    setIsAddModalOpen(false);
  };

  return (
    <GenericModal
      key="add-subscription-plan"
      open={isAddModalOpen}
      onOpenChange={setIsAddModalOpen}
      title="Create subscription plan"
      description="Define the properties for the new subscription plan."
      primaryAction={{
        label: "Create",
        onClick: () => {
          // TODO: hook up create logic
          setIsAddModalOpen(false);
        },
      }}
      secondaryAction={{
        label: "Cancel",
        variant: "outline",
        onClick: () => setIsAddModalOpen(false),
      }}
    >
      <div className="grid gap-4">
        {/* Replace this placeholder with the real form component */}
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input />
        </div>
        <div className="grid gap-2">
          <Label>Price (USD)</Label>
          <Input type="number" />
        </div>
      </div>
    </GenericModal>
  );
};

export default SubscriptionPlanCreateModal;

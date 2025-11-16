import { useSubscriptionPlanPageStore } from "@/billing-context/subscription-plan/presentation/stores/subscription-plan-page-store";
import GenericModal from "@repo/shared/presentation/components/molecules/generic-modal";

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
          <label className="text-sm font-medium">Name</label>
          <input className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-hidden focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Price (USD)</label>
          <input
            type="number"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-hidden focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </GenericModal>
  );
};

export default SubscriptionPlanCreateModal;

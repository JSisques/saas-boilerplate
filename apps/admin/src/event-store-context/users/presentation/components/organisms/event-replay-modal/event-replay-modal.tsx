'use client';

import { useEventPageStore } from '@/event-store-context/users/presentation/stores/event-page-store';
import { EventReplayRequestDto, useEvents } from '@repo/sdk';
import GenericModal from '@repo/shared/presentation/components/molecules/generic-modal';
import { Input } from '@repo/shared/presentation/components/ui/input';
import { Label } from '@repo/shared/presentation/components/ui/label';
import { useState } from 'react';

type EventReplayModalProps = {
  onReplayed?: () => void;
};

export const EventReplayModal = ({ onReplayed }: EventReplayModalProps) => {
  const { isReplayModalOpen, setIsReplayModalOpen } = useEventPageStore();
  const { replay } = useEvents();

  const [id, setId] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [aggregateId, setAggregateId] = useState<string>('');
  const [aggregateType, setAggregateType] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [batchSize, setBatchSize] = useState<string>('');

  const handleReplay = async () => {
    if (!from || !to) {
      return;
    }

    const input: EventReplayRequestDto = {
      from: new Date(from),
      to: new Date(to),
    };

    if (id) input.id = id;
    if (eventType) input.eventType = eventType;
    if (aggregateId) input.aggregateId = aggregateId;
    if (aggregateType) input.aggregateType = aggregateType;
    if (batchSize) input.batchSize = parseInt(batchSize, 10);

    await replay.fetch(input);

    if (replay.success) {
      onReplayed?.();
      setIsReplayModalOpen(false);
      // Reset form
      setId('');
      setEventType('');
      setAggregateId('');
      setAggregateType('');
      setFrom('');
      setTo('');
      setBatchSize('');
    }
  };

  const handleClose = () => {
    setIsReplayModalOpen(false);
    // Reset form
    setId('');
    setEventType('');
    setAggregateId('');
    setAggregateType('');
    setFrom('');
    setTo('');
    setBatchSize('');
  };

  return (
    <GenericModal
      key="event-replay-modal"
      open={isReplayModalOpen}
      onOpenChange={setIsReplayModalOpen}
      contentClassName="sm:max-w-2xl"
      contentBodyClassName="max-h-[75vh] overflow-y-auto"
      title="Replay Events"
      description="Configure the parameters to replay events from the event store."
      primaryAction={{
        label: 'Replay',
        onClick: handleReplay,
        disabled: replay.loading || !from || !to,
      }}
      secondaryAction={{
        label: 'Cancel',
        variant: 'outline',
        onClick: handleClose,
      }}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="id">Event ID (optional)</Label>
          <Input
            id="id"
            type="text"
            placeholder="Enter event ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="eventType">Event Type (optional)</Label>
          <Input
            id="eventType"
            type="text"
            placeholder="Enter event type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="aggregateId">Aggregate ID (optional)</Label>
          <Input
            id="aggregateId"
            type="text"
            placeholder="Enter aggregate ID"
            value={aggregateId}
            onChange={(e) => setAggregateId(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="aggregateType">Aggregate Type (optional)</Label>
          <Input
            id="aggregateType"
            type="text"
            placeholder="Enter aggregate type"
            value={aggregateType}
            onChange={(e) => setAggregateType(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="from">
            From Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="from"
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="to">
            To Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="to"
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="batchSize">Batch Size (optional)</Label>
          <Input
            id="batchSize"
            type="number"
            placeholder="Enter batch size (default: 500)"
            value={batchSize}
            onChange={(e) => setBatchSize(e.target.value)}
            min="1"
          />
        </div>

        {replay.error && (
          <div className="text-sm text-destructive mt-2">
            Error: {replay.error.message}
          </div>
        )}

        {replay.success && replay.data && (
          <div className="text-sm text-green-600 mt-2">
            {replay.data.message}
          </div>
        )}
      </div>
    </GenericModal>
  );
};

export default EventReplayModal;

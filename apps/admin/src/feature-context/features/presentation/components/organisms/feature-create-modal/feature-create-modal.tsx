'use client';

import { useFeaturePageStore } from '@/feature-context/features/presentation/stores/feature-page-store';
import { FEATURE_STATUSES, FeatureStatus, useFeatures } from '@repo/sdk';
import GenericModal from '@repo/shared/presentation/components/molecules/generic-modal';
import { Input } from '@repo/shared/presentation/components/ui/input';
import { Label } from '@repo/shared/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/presentation/components/ui/select';
import { Textarea } from '@repo/shared/presentation/components/ui/textarea';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type FeatureCreateModalProps = {
  onCreated?: () => void;
};

export const FeatureCreateModal = ({ onCreated }: FeatureCreateModalProps) => {
  const t = useTranslations('featuresPage.organisms.featureCreateModal');
  const { isAddModalOpen, setIsAddModalOpen } = useFeaturePageStore();
  const { create } = useFeatures();

  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<FeatureStatus>('ACTIVE');

  const handleCreate = async () => {
    if (!key || !name) {
      return;
    }

    try {
      await create.mutate({
        key,
        name,
        description: description || null,
        status,
      });
      handleClose();
      onCreated?.();
    } catch (error) {
      console.error('Error creating feature:', error);
    }
  };

  const handleClose = () => {
    setIsAddModalOpen(false);
    setKey('');
    setName('');
    setDescription('');
    setStatus('ACTIVE');
  };

  return (
    <GenericModal
      key="add-feature"
      open={isAddModalOpen}
      onOpenChange={setIsAddModalOpen}
      contentClassName="sm:max-w-lg"
      title={t('title')}
      description={t('description')}
      primaryAction={{
        label: t('actions.create'),
        onClick: handleCreate,
        disabled: !key || !name || create.loading,
      }}
      secondaryAction={{
        label: t('actions.cancel'),
        variant: 'outline',
        onClick: handleClose,
      }}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="key">
            {t('keyLabel')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="key"
            type="text"
            placeholder={t('keyPlaceholder')}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">{t('keyHint')}</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">
            {t('nameLabel')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder={t('namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">{t('descriptionLabel')}</Label>
          <Textarea
            id="description"
            placeholder={t('descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">{t('statusLabel')}</Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as FeatureStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('statusPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {FEATURE_STATUSES.map((statusValue) => (
                <SelectItem key={statusValue} value={statusValue}>
                  {statusValue}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </GenericModal>
  );
};

export default FeatureCreateModal;

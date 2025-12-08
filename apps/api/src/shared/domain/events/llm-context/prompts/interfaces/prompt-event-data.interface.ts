import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface IPromptEventData extends IBaseEventData {
  id: string;
  slug: string;
  version: number;
  title: string;
  description: string | null;
  content: string;
  status: string;
  isActive: boolean;
}

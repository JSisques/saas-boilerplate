import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface IUserEventData extends IBaseEventData {
  id: string;
  avatarUrl: string | null;
  bio: string | null;
  lastName: string | null;
  name: string | null;
  role: string;
  status: string;
  userName: string;
}

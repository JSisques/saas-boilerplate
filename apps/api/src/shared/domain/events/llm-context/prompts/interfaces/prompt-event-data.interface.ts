export interface IPromptEventData {
  id: string;
  slug: string;
  version: number;
  title: string;
  description: string | null;
  content: string;
  status: string;
  isActive: boolean;
}

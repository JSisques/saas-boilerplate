export interface IStorageCreateViewModelDto {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  provider: string;
  url: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

import { IStorageCreateViewModelDto } from '@/storage-context/storage/domain/dtos/view-models/storage-create-view-model/storage-create-view-model.dto';

export class StorageViewModel {
  private readonly _id: string;
  private readonly _fileName: string;
  private readonly _fileSize: number;
  private readonly _mimeType: string;
  private readonly _provider: string;
  private readonly _url: string;
  private readonly _path: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(props: IStorageCreateViewModelDto) {
    this._id = props.id;
    this._fileName = props.fileName;
    this._fileSize = props.fileSize;
    this._mimeType = props.mimeType;
    this._provider = props.provider;
    this._url = props.url;
    this._path = props.path;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public get id(): string {
    return this._id;
  }

  public get fileName(): string {
    return this._fileName;
  }

  public get fileSize(): number {
    return this._fileSize;
  }

  public get mimeType(): string {
    return this._mimeType;
  }

  public get provider(): string {
    return this._provider;
  }

  public get url(): string {
    return this._url;
  }

  public get path(): string {
    return this._path;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }
}

import { BaseViewModelWithTenant } from '@/shared/domain/view-models/base-view-model-with-tenant/base-view-model-with-tenant';
import { IStorageCreateViewModelDto } from '@/storage-context/storage/domain/dtos/view-models/storage-create-view-model/storage-create-view-model.dto';

export class StorageViewModel extends BaseViewModelWithTenant {
  private readonly _fileName: string;
  private readonly _fileSize: number;
  private readonly _mimeType: string;
  private readonly _provider: string;
  private readonly _url: string;
  private readonly _path: string;

  constructor(props: IStorageCreateViewModelDto) {
    super({
      id: props.id,
      tenantId: props.tenantId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this._fileName = props.fileName;
    this._fileSize = props.fileSize;
    this._mimeType = props.mimeType;
    this._provider = props.provider;
    this._url = props.url;
    this._path = props.path;
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
}

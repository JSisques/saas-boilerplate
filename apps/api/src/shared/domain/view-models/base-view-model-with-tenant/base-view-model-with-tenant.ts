import { BaseViewModel } from '@/shared/domain/view-models/base-view-model/base-view-model';

/**
 * Base class for ViewModels that require tenant isolation.
 * Extends BaseViewModel and adds tenantId property (optional).
 *
 * Use this class for ViewModels that are stored in a shared database
 * but need to be filtered by tenantId. The tenantId is optional to allow
 * factories to create ViewModels without tenant context, but should be
 * provided when saving to tenant-isolated repositories.
 */
export abstract class BaseViewModelWithTenant extends BaseViewModel {
  protected readonly _tenantId: string | null;

  constructor(props: {
    id: string;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this._tenantId = props.tenantId ?? null;
  }

  /**
   * Get the tenant id of the view model.
   *
   * @returns The tenant id of the view model, or null if not set.
   */
  public get tenantId(): string | null {
    return this._tenantId;
  }
}

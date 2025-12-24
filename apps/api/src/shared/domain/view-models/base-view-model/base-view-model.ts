/**
 * Base class for all ViewModels.
 * Provides common properties: id, createdAt, and updatedAt.
 *
 * All ViewModels should extend this class to ensure consistency
 * across the application.
 */
export abstract class BaseViewModel {
  protected readonly _id: string;
  protected readonly _createdAt: Date;
  protected readonly _updatedAt: Date;

  constructor(props: { id: string; createdAt: Date; updatedAt: Date }) {
    this._id = props.id;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Get the id of the view model.
   *
   * @returns The id of the view model.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Get the created at of the view model.
   *
   * @returns The created at of the view model.
   */
  public get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Get the updated at of the view model.
   *
   * @returns The updated at of the view model.
   */
  public get updatedAt(): Date {
    return this._updatedAt;
  }
}

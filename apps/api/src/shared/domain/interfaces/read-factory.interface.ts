/**
 * Base interface for read factories that create view models and DTOs.
 * These factories are responsible for creating read models from
 * domain entities or primitive data for presentation purposes.
 */
export interface IReadFactory<TViewModel, TSource = any> {
  /**
   * Creates a view model from domain entity/aggregate.
   *
   * @param source - The domain entity or aggregate
   * @returns The created view model
   */
  fromAggregate(source: TSource): TViewModel;

  /**
   * Creates a view model from primitive data.
   *
   * @param primitives - The primitive data
   * @returns The created view model
   */
  fromPrimitives(primitives: any): TViewModel;

  /**
   * Creates a view model from DTO or request data.
   *
   * @param dto - The DTO or request data
   * @returns The created view model
   */
  fromDto?(dto: any): TViewModel;
}

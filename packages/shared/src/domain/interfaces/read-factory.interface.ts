/**
 * Base interface for read factories that create view models and DTOs.
 * These factories are responsible for creating read models from
 * domain entities or primitive data for presentation purposes.
 */
export interface IReadFactory<
  TViewModel,
  TCreateProps = unknown,
  TSource = unknown,
  TPrimitives = unknown,
> {
  /**
   * Creates a new view model from the given data.
   *
   * @param data - The data to create the view model from
   * @returns The created view model
   */
  create(data: TCreateProps): TViewModel;
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
  fromPrimitives(primitives: TPrimitives): TViewModel;
}

/**
 * Base interface for write factories that create domain entities.
 * These factories are responsible for creating aggregates and entities
 * from primitive data or command data.
 */
export interface IWriteFactory<
  TEntity,
  TCreateProps = unknown,
  TPrimitives = unknown,
> {
  /**
   * Creates a new entity from the given properties.
   *
   * @param data - The data to create the entity from
   * @returns The created entity
   */
  create(data: TCreateProps): TEntity;

  /**
   * Creates an entity from primitive data (usually from database).
   *
   * @param primitives - The primitive data to create the entity from
   * @returns The created entity
   */
  fromPrimitives(primitives: TPrimitives): TEntity;
}

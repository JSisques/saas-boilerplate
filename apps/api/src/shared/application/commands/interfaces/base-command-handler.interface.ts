export interface IBaseCommandHandler<TCommand> {
  executeAsserts?(command: TCommand): Promise<void[]>;
}

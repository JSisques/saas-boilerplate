export class CreateUserCommand {
  constructor(
    readonly name: string,
    readonly bio?: string,
    readonly avatar?: string,
  ) {}
}

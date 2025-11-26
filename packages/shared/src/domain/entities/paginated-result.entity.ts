export class PaginatedResult<T> {
  constructor(
    public items: T[],
    public total: number,
    public page: number,
    public perPage: number,
  ) {}

  get totalPages() {
    return Math.ceil(this.total / this.perPage);
  }
}

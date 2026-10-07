export class BackendOperationError<C extends string = string> extends Error {
  readonly status: number;
  readonly code: C;

  constructor(status: number, code: C) {
    super(code);
    this.name = 'BackendOperationError';
    this.status = status;
    this.code = code;
  }
}

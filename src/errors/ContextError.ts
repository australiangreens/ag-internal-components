import { AgError } from '@australiangreens/ag-error';

// Superclass for errors involving React context.
export class ContextError extends AgError {
  static errorName = 'ContextError';
}

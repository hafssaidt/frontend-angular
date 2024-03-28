/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from './app-error';

export class NotFoundError extends AppError {
  constructor(public override originalError?: any, public message?: string) {
    super(originalError);
    this.message = message || 'Requested resource not found.';
  }
}

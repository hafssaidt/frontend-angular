import { AppError } from "./app-error";

export class ForbiddenError extends AppError {
  constructor(public override originalError?: any, public message?: string) {
    super(originalError);
    this.message = message || "Access to the requested resource is forbidden.";
  }
}

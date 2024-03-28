import { AppError } from "./app-error";

export class BadInput extends AppError {
  constructor(public override originalError?: any, public message?: string) {
    super(originalError);
    this.message = message || "Bad input error occurred.";
  }
}

import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appNoWhitespace][ngModel]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NoWhitespaceValidatorDirective,
      multi: true,
    },
  ],
})
export class NoWhitespaceValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value?.length > 0) {
      const isWhitespace = control.value.trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    }
    return null;
  }
}

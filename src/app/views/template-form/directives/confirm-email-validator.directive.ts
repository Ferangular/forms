import { Directive } from '@angular/core';
import {AbstractControl, isFormGroup, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[confirmEmail]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ConfirmEmailValidator,
      multi: true
    }
  ]
})
export class ConfirmEmailValidator implements Validator{

  validate(formGroup: AbstractControl): ValidationErrors | null {
    console.log(formGroup);

    const emailControl = formGroup.get('email');
    const confirmEmailControl = formGroup.get('confirm-email');


     const error: ValidationErrors | null =  emailControl?.value === confirmEmailControl?.value ? null: {noMatch: true}

    confirmEmailControl?.setErrors(error)

    return error;
  }

}

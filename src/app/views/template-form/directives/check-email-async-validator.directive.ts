import {Directive, inject} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {GetEmailService} from '../../../services/get-email.service';
import {map, Observable, of, tap} from 'rxjs';

@Directive({
  selector: '[checkEmail]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: CheckEmailAsyncValidator,
      multi: true
    }
  ]
})
export class CheckEmailAsyncValidator implements AsyncValidator {

 private  _getEmailService = inject(GetEmailService);

 validate(control: AbstractControl): Observable<ValidationErrors | null> {
   return this._getEmailService.getEmails().pipe(
     // tap(console.log)
     map(emailList =>{
       const foundEmail = emailList.find( email => email === control?.value);
       return !foundEmail ? null : { isAnExistingEmail: true }
     })
   );
 }


}

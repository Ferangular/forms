import { Directive } from '@angular/core';
import {MY_VALIDATOR, MyValidatorInterface} from './my-tokens';

@Directive({
  selector: '[secondValidator]',
  providers: [
    { provide: MY_VALIDATOR , useExisting: SecondValidator, multi: true }
  ]
})
export class SecondValidator implements MyValidatorInterface{

  validate() {
    console.log('SecondValidator')
  }
}

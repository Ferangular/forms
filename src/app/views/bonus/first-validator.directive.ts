import { Directive } from '@angular/core';
import {MY_VALIDATOR, MyValidatorInterface} from './my-tokens';

@Directive({
  selector: '[firstValidator]',
  providers: [
    { provide: MY_VALIDATOR , useExisting: FirstValidator, multi: true }
  ]
})
export class FirstValidator implements MyValidatorInterface{

validate() {
  console.log('FirstValidator')
}
}

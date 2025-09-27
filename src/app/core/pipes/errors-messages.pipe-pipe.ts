import {inject, Pipe, PipeTransform} from '@angular/core';
import {VALIDATION_ERROR_MESSAGES} from '../validation-error-messages.token';

@Pipe({
  name: 'errorsMessages'
})
export class ErrorsMessagesPipePipe implements PipeTransform {

  errorMessages = inject(VALIDATION_ERROR_MESSAGES);

  transform(key: string, errorValue: any) {

    if (!this.errorMessages[key]) {
      console.warn(`We don´t have message for this validator ${key}`);
      return '';
    }

    return this.errorMessages[key](errorValue);
  }


}

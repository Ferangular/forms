import {Component, inject, input} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {KeyValuePipe} from '@angular/common';
import {VALIDATION_ERROR_MESSAGES, ValidationMessageMap} from '../../core/validation-error-messages.token';

@Component({
  selector: 'cs-input-error',
  imports: [
    KeyValuePipe
  ],
  templateUrl: './input-error.component.html',
  styleUrl: './input-error.component.scss'
})
export class InputErrorComponent {
  errors = input<ValidationErrors | null>(null);
  errorMessages = inject(VALIDATION_ERROR_MESSAGES);
constructor() {
  console.log(this.errors())
}
  // Devuelve el texto, sea que la entrada sea string o función, o no exista
  getMessage = (entry: { key: string; value: unknown }) => {
    const m = (this.errorMessages as ValidationMessageMap)[entry.key];
    if (typeof m === 'function') return m(entry.value);
    if (typeof m === 'string') return m;
    return entry.key; // fallback si no hay mensaje definido
  };

  name = {
    first: 'fer',
    last: true
  }
}

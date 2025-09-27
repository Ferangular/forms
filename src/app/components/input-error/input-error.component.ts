import {Component, inject, input} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {KeyValuePipe} from '@angular/common';
import {VALIDATION_ERROR_MESSAGES, ValidationMessageMap} from '../../core/validation-error-messages.token';
import {ErrorsMessagesPipePipe} from '../../core/pipes/errors-messages.pipe-pipe';

@Component({
  selector: 'cs-input-error',
  imports: [
    KeyValuePipe, ErrorsMessagesPipePipe
  ],
  templateUrl: './input-error.component.html',
  styleUrl: './input-error.component.scss'
})
export class InputErrorComponent {
  errors = input<ValidationErrors | null>(null);
  errorMessages = inject(VALIDATION_ERROR_MESSAGES);

  except = input<string[]>([]); //


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

  filteredErrors(): ValidationErrors | null {
    const e = this.errors();
    if (!e) return null;
    const ex = this.except() ?? [];
    const copy: any = { ...e };
    for (const k of ex) delete copy[k];
    return Object.keys(copy).length ? copy : null;
  }
}

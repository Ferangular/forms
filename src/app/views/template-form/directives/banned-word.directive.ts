import {Directive, input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validators} from '@angular/forms';
// NG_VALIDATORS -> para indicar al ng_model de que se trata de una directiva  que se puede usar cmo un validador
/**
 * Validador de palabras prohibidas.
 *
 * Uso:
 *  <!-- una palabra -->
 *  <input name="username" [(ngModel)]="username" bannedWord="admin" />
 *
 *  <!-- varias palabras (string separado por comas) -->
 *  <textarea name="bio" [(ngModel)]="bio" bannedWord="admin, root, test"></textarea>
 *
 *  <!-- varias palabras (array) -->
 *  <input name="title" [(ngModel)]="title" [bannedWord]="['foo','bar']" />
 *
 * Devuelve el error:
 *  { bannedWord: { word: '...' } }
 * o `null` si es válido.
 */
@Directive({
  selector: '[bannedWord]',
  providers: [
    /**
     * Registramos esta directiva como **validador síncrono**.
     * `multi: true` = se añade a la lista existente de validadores,
     * no sustituye a los que ya hay.
     */
    { provide: NG_VALIDATORS, useExisting: BannedWordDirective, multi: true }
  ]
})
export class BannedWordDirective implements Validators{

  bannedWord= input.required<string | string[]>();


  validate( control: AbstractControl<string>): ValidationErrors | null {
    const raw = this.bannedWord();
    const value = (control.value ?? '').toLowerCase();

    if (raw == null || !value) return null;

    // Normaliza a array de palabras en minúsculas (admite coma-separado)
    const words = (Array.isArray(raw) ? raw : raw.split(','))
      .map(w => w.trim())
      .filter(Boolean)
      .map(w => w.toLowerCase());

    if (words.length === 0) return null;

    // Igualdad exacta con cualquiera de las prohibidas
    const hit = words.find(w => value === w);

    return hit ? { bannedWordValidator: { word: hit } } : null;
  }

}

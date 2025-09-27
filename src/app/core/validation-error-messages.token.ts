import {InjectionToken} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

export type ValidationMessage = (v: unknown) => string;
export type ValidationMessageMap = Readonly<Record<string, ValidationMessage>>;

// Define tus patrones como RegExp
const numberPattern = /^\d*$/;
const urlPattern = /^(https?:\/\/).+/;

export const ERROR_MESSAGES: ValidationMessageMap = {
  required: ()=> 'This field is required',
  minlength:   (v: any) => `The required length is ${v?.requiredLength}`,
  bannedWordValidator: (v: any) => `The following word is banned: ${v?.word ?? v}`,
  email:  ()=>'You must type an email ***&#64;***',
  isAnExistingEmail: ()=> 'This email is already taken',
  noMatch: ()=> `Emails doesn't match`,
  // Mensaje dinámico según el patrón que haya fallado
  pattern: (err => {
    const required = (err as ValidationErrors['pattern'])?.requiredPattern ?? '';
    switch (required) {
      case numberPattern.source:
        return 'This field only accepts numbers';
      case urlPattern.source:
        return 'It should be something like https://www.example.com';
      default:
        return `This field doesn't have the right format`;
    }
  })
};

export const VALIDATION_ERROR_MESSAGES = new InjectionToken<ValidationMessageMap>(
  'VALIDATION_ERROR_MESSAGES',
  { providedIn: 'root', factory: () => ERROR_MESSAGES }
);

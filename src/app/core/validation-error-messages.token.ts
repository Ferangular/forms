import {InjectionToken} from '@angular/core';

export type ValidationMessage = (v: unknown) => string;
export type ValidationMessageMap = Readonly<Record<string, ValidationMessage>>;

export const ERROR_MESSAGES: ValidationMessageMap = {
  required: ()=> 'This field is required',
  minlength:   (v: any) => `The required length is ${v?.requiredLength}`,
  bannedWordValidator: (v: any) => `The following word is banned: ${v?.word ?? v}`,
  email:  ()=>'You must type an email ***&#64;***',
  isAnExistingEmail: ()=> 'This email is already taken',
  noMatch: ()=> `Emails doesn't match`,
  pattern: ()=> `This field doesn't have the right format`,
}

export const VALIDATION_ERROR_MESSAGES = new  InjectionToken('VALIDATION_ERROR_MESSAGES', {
  providedIn: 'root',
  factory: () => ERROR_MESSAGES
})

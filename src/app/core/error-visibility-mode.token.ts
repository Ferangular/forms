// error-visibility.token.ts
import { InjectionToken } from '@angular/core';

export type ErrorVisibilityMode =
  | 'touched'
  | 'dirty'
  | 'dirtyOrSubmitted'
  | 'touchedOrSubmitted';

export const ERROR_VISIBILITY_MODE = new InjectionToken<ErrorVisibilityMode>(
  'ERROR_VISIBILITY_MODE',
  { providedIn: 'root', factory: () => 'dirtyOrSubmitted' } // default sensato
);

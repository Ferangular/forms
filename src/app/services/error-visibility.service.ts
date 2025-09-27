import {Inject, Injectable} from '@angular/core';
import {ERROR_VISIBILITY_MODE, ErrorVisibilityMode} from '../core/error-visibility-mode.token';
import {NgForm, NgModel, NgModelGroup} from '@angular/forms';

type Ctrls = NgModel | NgModelGroup | NgForm;

@Injectable({
  providedIn: 'root'
})
export class ErrorVisibilityService {
  constructor(@Inject(ERROR_VISIBILITY_MODE) private mode: ErrorVisibilityMode) {}

  shouldShow(ctrl: Ctrls, form?: NgForm): boolean {
    const invalid = !!ctrl.invalid;
    const dirty = !!ctrl.dirty;
    const touched = !!ctrl.touched;
    const submitted = !!form?.submitted;

    switch (this.mode) {
      case 'touched':             return invalid && touched;
      case 'dirty':               return invalid && dirty;
      case 'touchedOrSubmitted':  return invalid && (touched || submitted);
      case 'dirtyOrSubmitted':
      default:                    return invalid && (dirty || submitted);
    }
  }
}

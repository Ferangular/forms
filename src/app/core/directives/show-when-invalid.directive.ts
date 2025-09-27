
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { AbstractControlDirective, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

// alias para evitar escribir el genérico
type Ctl = AbstractControlDirective;

interface ShowWhenInvalidContext {
  $implicit: any;          // errores (para "let errs")
  errors: any;             // alias de errores
}

@Directive({
  selector: '[csShowWhenInvalid]',
  standalone: true,
})
export class ShowWhenInvalidDirective implements OnChanges, OnDestroy {
  // Microsintaxis:
  // *csShowWhenInvalid="email; form: form; errorKey: 'minlength'; let errs"
  @Input('csShowWhenInvalid') control!: AbstractControlDirective | null;
  @Input('csShowWhenInvalidForm') form?: NgForm | null;
  @Input('csShowWhenInvalidErrorKey') errorKey?: string | null;

  private ctx: ShowWhenInvalidContext = { $implicit: null, errors: null };
  private viewCreated = false;
  private sub?: Subscription;

  constructor(
    private tpl: TemplateRef<ShowWhenInvalidContext>,
    private vcr: ViewContainerRef
  ) {}

  ngOnChanges(): void {
    this.rebind();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private rebind() {
    this.sub?.unsubscribe();

    const ctl = this.control?.control ?? null;
    if (!ctl) return;

    this.sub = new Subscription();
    if (ctl.statusChanges) this.sub.add(ctl.statusChanges.subscribe(() => this.update()));
    if (ctl.valueChanges)  this.sub.add(ctl.valueChanges.subscribe(() => this.update()));
    if (this.form?.ngSubmit) this.sub.add(this.form.ngSubmit.subscribe(() => this.update()));

    this.update();
  }

  private shouldShow(): boolean {
    const dir = this.control;
    if (!dir) return false;

    const submitted = !!this.form?.submitted;
    const touchedOrDirty = dir.touched || dir.dirty || submitted;
    if (!touchedOrDirty) return false;

    if (this.errorKey) {
      return !!(dir.errors && Object.prototype.hasOwnProperty.call(dir.errors, this.errorKey));
    }
    return <boolean>dir.invalid;
  }

  private currentErrors() {
    const errs = this.control?.errors ?? this.control?.control?.errors ?? null;
    if (!errs) return null;
    if (!this.errorKey) return errs;
    return errs[this.errorKey] != null ? { [this.errorKey]: errs[this.errorKey] } : null;
  }

  private update() {
    const show = this.shouldShow();
    this.ctx.$implicit = this.ctx.errors = this.currentErrors();

    if (show && !this.viewCreated) {
      this.vcr.createEmbeddedView(this.tpl, this.ctx);
      this.viewCreated = true;
    } else if (!show && this.viewCreated) {
      this.vcr.clear();
      this.viewCreated = false;
    }
  }
}

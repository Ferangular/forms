import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component, computed,
  effect,
  forwardRef,
  input,
  numberAttribute, signal
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'cs-star-rating',
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true,
    },
  ],
})
export class StarRatingComponent implements ControlValueAccessor {

  // ====== Inputs como en el curso ======
  starCount = input(5, { transform: numberAttribute });   // alias “natural” en plantilla
  size      = input(28, { transform: numberAttribute });
  readonly  = input(false, { transform: booleanAttribute });

  // ====== Estado interno (signals) ======
  rating = signal(0);            // ⭐ valor actual (0..starCount)
  hoveredIndex = signal(-1);     // -1 = sin hover
  disabled = false;

  // arreglo para pintar (mismo patrón de la captura)
  stars: boolean[] = [];

  // ====== CVA (callbacks) ======
  private onChange: (v: number) => void = () => {};
  private onTouched: () => void = () => {};
  private touched = false;

  // ====== Ciclo de vida ======
  ngOnInit(): void {
    this.stars = gettingStars(this.starCount());
    // reconstruir si cambia starCount
    effect(() => {
      const n = this.starCount();
      this.stars = gettingStars(n);
      // clamp si el rating supera el nuevo máximo
      if (this.rating() > n) this.rating.set(n);
    });
  }

  // ====== Interacción UI ======
  rate(value: number) {
    if (this.disabled || this.readonly()) return;
    this.markTouched();
    this.rating.set(value);
    this.onChange(value);
  }

  handleMouseOver(index: number) {
    if (this.disabled || this.readonly()) return;
    this.hoveredIndex.set(index);
  }

  handleMouseLeave() {
    this.hoveredIndex.set(-1);
  }

  // ====== ControlValueAccessor ======
  writeValue(value: number | null): void {
    this.rating.set(Number(value ?? 0));
  }

  registerOnChange(fn: (v: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private markTouched() {
    if (this.touched) return;
    this.onTouched();
    this.touched = true;
  }
}

// ====== Función libre (como en la captura) ======
function gettingStars(value: number): boolean[] {
  return Array(value).fill(false);
}

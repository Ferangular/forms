import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component, effect,
  forwardRef,

  signal,

} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {StarRatingComponent} from '../../components/star-rating/star-rating';


@Component({
  selector: 'cs-value-accessor',
  imports: [
    StarRatingComponent,
    ReactiveFormsModule
  ],
  templateUrl: './value-accessor.component.html',
  styleUrl: './value-accessor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueAccessorComponent {
  // ⭐ control para el ejemplo de Reactive Forms
  ratingCtrl = new FormControl(3, { nonNullable: true });

  // ⭐ número de estrellas del primer componente (controlado por el padre)
  starCount = signal(5);

  addStar() {
    // sube 1 hasta un máximo (ajústalo si quieres)
    this.starCount.update(n => Math.min(n + 1, 10));
    // si solo quieres ver el valor del form control, deja el console.log:
    // console.log(this.ratingCtrl.value);
  }
}

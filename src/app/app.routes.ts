import { Routes } from '@angular/router';
import {TemplateForm} from './views/template-form/template-form';
import {ReactiveForm} from './views/reactive-form/reactive-form';
import {ValueAccessorComponent} from './views/value-accessor.component/value-accessor.component';

export const routes: Routes = [
  { path: 'template-driven-forms', component: TemplateForm },
  { path: 'reactive-forms', component: ReactiveForm },
  { path: 'control-value-accessor', component: ValueAccessorComponent },
  { path: '**', pathMatch: 'full' , redirectTo: 'template-driven-forms'}
];

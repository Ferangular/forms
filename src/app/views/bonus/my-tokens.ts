import {InjectionToken} from '@angular/core';
import {FirstService} from '../../services/first.service';

export const MY_TOKEN = new InjectionToken<FirstService>('MY_TOKEN')
export const CHILDREN_COMPONENT = new InjectionToken<ChildrenInterface>('CHILDREN_COMPONENT')

export const MY_VALIDATOR = new InjectionToken<MyValidatorInterface[]>('MY_VALIDATOR');
export const CAR_BRAND = new InjectionToken('CAR_BRAND', {
  providedIn: 'root',
  factory: () => ([
    'Toyota',
    'Mazda',
    'Ford'
  ])
});

export interface ChildrenInterface {
  childrenName: string;
}

export interface MyValidatorInterface {
  validate: () => void;
}

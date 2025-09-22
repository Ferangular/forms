import { Component } from '@angular/core';
import {CHILDREN_COMPONENT, ChildrenInterface} from '../../views/bonus/my-tokens';

@Component({
  selector: 'cs-first-child',
  imports: [],
  templateUrl: './first-child.component.html',
  styleUrl: './first-child.component.scss',
  providers: [
    { provide: CHILDREN_COMPONENT, useExisting: FirstChildComponent }
  ]
})
export class FirstChildComponent implements ChildrenInterface{
  childrenName= 'FirstChildComponent';

}

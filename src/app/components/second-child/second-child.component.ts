import { Component } from '@angular/core';
import {CHILDREN_COMPONENT, ChildrenInterface} from '../../views/bonus/my-tokens';

@Component({
  selector: 'cs-second-child',
  imports: [],
  templateUrl: './second-child.component.html',
  styleUrl: './second-child.component.scss',
  providers: [
    { provide: CHILDREN_COMPONENT, useExisting: SecondChildComponent }
  ]
})
export class SecondChildComponent implements ChildrenInterface{
  childrenName= 'SecondChildComponent';

}

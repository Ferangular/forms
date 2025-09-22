import { Component } from '@angular/core';
import {Container} from '../../components/container/container';
import {FirstChildComponent} from '../../components/first-child/first-child.component';
import {SecondChildComponent} from '../../components/second-child/second-child.component';
import {FirstValidator} from './first-validator.directive';
import {SecondValidator} from './second.directive';

@Component({
  selector: 'cs-bonus',
  imports: [
    Container,
    FirstValidator,
    SecondValidator
  ],
  templateUrl: './bonus.html',
  styleUrl: './bonus.scss'
})
export class Bonus {

}

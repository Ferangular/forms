import {Component, contentChild,  Inject, inject, InjectionToken, OnInit} from '@angular/core';
import {FirstService} from '../../services/first.service';

import {CAR_BRAND, CHILDREN_COMPONENT, MY_VALIDATOR, MyValidatorInterface} from '../../views/bonus/my-tokens';

const MY_TOKEN = new InjectionToken<FirstService>('MY_TOKEN')

@Component({
  selector: 'cs-container',
  imports: [],
  templateUrl: './container.html',
  styleUrl: './container.scss',
  providers: [
    // FirstService
    { provide: MY_TOKEN, useClass: FirstService  },
    { provide: CAR_BRAND, useValue: ['BMW', 'Audi', 'Lexus']}
  ]
})
export class Container implements OnInit{
  // private _firstService = inject<FirstService>(MY_TOKEN)

  carBrands = inject(CAR_BRAND, {skipSelf: false}); //{skipSelf: true}

  private _myValidators: MyValidatorInterface[] | null = inject(MY_VALIDATOR, {optional: true, self: true }) ;

  child = contentChild(CHILDREN_COMPONENT);

  constructor(@Inject(MY_TOKEN) private _firstService: FirstService) {  }

  ngOnInit() {
    // console.log(this._firstService.message);
    // console.log(this.child()?.childrenName);
    console.log(this._myValidators)
    this._myValidators?.forEach((v)=>{
      v.validate()
    })
  }

}

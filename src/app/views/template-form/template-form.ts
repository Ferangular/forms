import { Component } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';

import {ApplicantForm} from './interfaces/applicant-form';
import {BannedWordDirective} from './directives/banned-word.directive';
// import {TemplateFormDirective} from '../../directives/template-form.directive';

@Component({
  selector: 'cs-template-form',
  imports: [FormsModule,  BannedWordDirective],
  templateUrl: './template-form.html',
  styleUrl: './template-form.scss'
})
export class TemplateForm {

  positions = ['Angular Developer', 'PHP Developer', 'Java Developer', 'Python'];

  applicantForm: ApplicantForm ={
    name:{
      first: '',
      last: '',
    },
    email: '',
    employmentStatus: '',
    positionSelected: '',
    resumeLink: ''
  }

  handleSubmit(form: NgForm){
    console.log(form)
  }

  onReset(form: NgForm) {
    form.resetForm({
name:{
  first: '',
  last: '',
},
      email: '',
      employmentStatus: '',
      positionSelected: '',
      resumeLink: ''
    });
  }
}

import { Component } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {JsonPipe} from '@angular/common';
// import {TemplateFormDirective} from '../../directives/template-form.directive';

@Component({
  selector: 'cs-template-form',
  imports: [FormsModule, JsonPipe],
  templateUrl: './template-form.html',
  styleUrl: './template-form.scss'
})
export class TemplateForm {

  positions = ['Angular Developer', 'PHP Developer', 'Java Developer', 'Python'];

  applicantForm ={
    firstName: '',
    lastName: '',
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
      firstName: '',
      lastName: '',
      email: '',
      employmentStatus: '',
      positionSelected: '',
      resumeLink: ''
    });
  }
}

import {Component} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';

import {ApplicantForm, VerifyAccount} from './interfaces/applicant-form';
import {BannedWordDirective} from './directives/banned-word.directive';
import {ConfirmEmailValidator} from './directives/confirm-email-validator.directive';
import {CheckEmailAsyncValidator} from './directives/check-email-async-validator.directive';

// import {TemplateFormDirective} from '../../directives/template-form.directive';

@Component({
  selector: 'cs-template-form',
  imports: [FormsModule, BannedWordDirective, ConfirmEmailValidator, CheckEmailAsyncValidator],
  templateUrl: './template-form.html',
  styleUrl: './template-form.scss'
})
export class TemplateForm {

  verifyAccountWith: VerifyAccount = 'email';

  positions = ['Angular Developer', 'PHP Developer', 'Java Developer', 'Python'];

  applicantForm: ApplicantForm = {
    name: {
      first: '',
      last: '',
    },
    email: {
      email: '',
      confirmEmail: '',
    },
    employmentStatus: '',
    positionSelected: '',
    resumeLink: '',
    phoneNumber: ''
  }

  handleSubmit(form: NgForm) {
    console.log(form)
  }

  onReset(form: NgForm) {
    form.resetForm({
      name: {
        first: '',
        last: '',
      },
      email: {
        email: '',
        confirmEmail: '',
      },

      employmentStatus: '',
      positionSelected: '',
      resumeLink: '',
      phoneNumber: ''
    });
  }

  handleKeypress(event: KeyboardEvent) {
    if (RegExp(/^\d$/).exec(event.key)) {
      event.preventDefault();
    }
  }

  handlePhoneNumber() {
    this.applicantForm.phoneNumber = '';
  }
}

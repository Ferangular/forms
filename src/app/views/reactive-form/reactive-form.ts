import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormRecord,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {map, Observable, of, switchMap, timer} from 'rxjs';
import {KeyValuePipe, TitleCasePipe} from '@angular/common';


/* ---------- Tipos ---------- */
type EmploymentStatus = 'employed' | 'self-employed' | 'unemployed' | 'student';

interface ReferenceFG {
  name: FormControl<string>;
  contact: FormControl<string>;
}

interface EmailFG {
  email: FormControl<string>;
  confirmEmail: FormControl<string>;
}

interface NameFG {
  first: FormControl<string>;
  last: FormControl<string>;
}

interface JobForm {
  name: FormGroup<NameFG>;
  email: FormGroup<EmailFG>;
  employmentStatus: FormControl<EmploymentStatus | null>;
  positionSelected: FormControl<string | null>;
  resumeLink: FormControl<string>;
  verifyAccountWith: FormControl<'email' | 'phone number'>;
  phoneNumber: FormControl<string>;
  references: FormArray<FormGroup<ReferenceFG>>;
  skills: FormRecord<FormControl<boolean>>;   // ← AHORA ES FormRecord
}

/* ---------- Validadores personalizados ---------- */
function bannedWord(word: string) {
  return (c: AbstractControl): ValidationErrors | null => {
    const v = (c.value ?? '').toString().trim();
    if (!v) return null;
    return new RegExp(`\\b${word}\\b`, 'i').test(v)
      ? { bannedWordValidator: { word } }
      : null;
  };
}

function emailsMatch(group: AbstractControl): ValidationErrors | null {
  const e = group.get('email')?.value;
  const c = group.get('confirmEmail')?.value;
  if (!e || !c) return null;
  return e === c ? null : { noMatch: true };
}

/* ---------- Validador asíncrono (simulado) ---------- */
function checkEmailAsync(): AsyncValidatorFn {
  const taken = ['taken@example.com', 'john@doe.com'];
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = (control.value ?? '').toString().trim();
    if (!value) return of(null);
    return timer(400).pipe(
      switchMap(() => of(taken.includes(value.toLowerCase()))),
      map(isTaken => (isTaken ? { isAnExistingEmail: true } : null))
    );
  };
}

@Component({
  selector: 'cs-reactive-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleCasePipe,
    KeyValuePipe
  ],
  templateUrl: './reactive-form.html',
  styleUrl: './reactive-form.scss'
})
export class ReactiveForm  implements OnInit {
  private fb = inject(FormBuilder);
  private nfb: NonNullableFormBuilder = (this.fb as any).nonNullable ?? this.fb;

  jobForm!: FormGroup<JobForm>;
  submitted = false;

  positions = ['Frontend Developer', 'Backend Developer', 'Full-Stack', 'QA'];

  ngOnInit(): void {
    this.jobForm = this.fb.group<JobForm>(
      {
        name: this.fb.group<NameFG>({
          first: this.nfb.control('', { validators: [Validators.required, Validators.minLength(2)], updateOn: 'change' }),
          last: this.nfb.control('', [Validators.required, Validators.minLength(2), bannedWord('Doe')]),
        }),

        email: this.fb.group<EmailFG>({
          email: this.nfb.control('', {
            validators: [Validators.required, Validators.email],
            asyncValidators: [checkEmailAsync()],
            updateOn: 'blur'
          }),
          confirmEmail: this.nfb.control('')
        }, { validators: [emailsMatch] }),

        employmentStatus: this.fb.control<EmploymentStatus | null>(null, { validators: Validators.required }),
        positionSelected: this.fb.control<string | null>(null, { validators: Validators.required }),
        resumeLink: this.nfb.control('', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]),

        verifyAccountWith: this.nfb.control<'email' | 'phone number'>('email'),
        phoneNumber: this.nfb.control('', []),

        references: this.fb.array<FormGroup<ReferenceFG>>([]),

        // ← FormRecord correctamente instanciado
        skills: new FormRecord<FormControl<boolean>>({
          angular: this.nfb.control(false),
          react: this.nfb.control(false),
          nest: this.nfb.control(false),
        })
      },
      { updateOn: 'blur' }
    );

    // Validadores dinámicos según verifyAccountWith
    this.verifyAccountWithCtrl.valueChanges.subscribe(val => {
      if (val === 'phone number') {
        this.phoneNumberCtrl.addValidators([Validators.required, Validators.minLength(4), Validators.pattern(/^\d+$/)]);
      } else {
        this.phoneNumberCtrl.clearValidators();
        this.phoneNumberCtrl.setValue('');
      }
      this.phoneNumberCtrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  /* ---------- Getters para el template ---------- */
  get nameGroup() { return this.jobForm.get('name') as FormGroup<NameFG>; }
  get firstCtrl() { return this.jobForm.get('name.first') as FormControl<string>; }
  get lastCtrl()  { return this.jobForm.get('name.last') as FormControl<string>; }

  get emailGroup()       { return this.jobForm.get('email') as FormGroup<EmailFG>; }
  get emailCtrl()        { return this.jobForm.get('email.email') as FormControl<string>; }
  get confirmEmailCtrl() { return this.jobForm.get('email.confirmEmail') as FormControl<string>; }

  get employmentStatusCtrl() { return this.jobForm.get('employmentStatus') as FormControl<EmploymentStatus | null>; }
  get positionSelectedCtrl() { return this.jobForm.get('positionSelected') as FormControl<string | null>; }
  get resumeLinkCtrl()       { return this.jobForm.get('resumeLink') as FormControl<string>; }

  get verifyAccountWithCtrl() { return this.jobForm.get('verifyAccountWith') as FormControl<'email' | 'phone number'>; }
  get phoneNumberCtrl()       { return this.jobForm.get('phoneNumber') as FormControl<string>; }

  get referencesFA() { return this.jobForm.get('references') as FormArray<FormGroup<ReferenceFG>>; }
  get skillsRecord() { return this.jobForm.get('skills') as FormRecord<FormControl<boolean>>; }

  /* ---------- API dinámica ---------- */
  addReference() {
    const ref = this.fb.group<ReferenceFG>({
      name: this.nfb.control('', [Validators.required]),
      contact: this.nfb.control('', [Validators.required]),
    });
    this.referencesFA.push(ref);
  }
  removeReference(i: number) { this.referencesFA.removeAt(i); }

  toggleSkill(key: string) {
    const c = this.skillsRecord.controls[key];
    if (c) c.setValue(!c.value);
  }

  /* ---------- Submit & Reset ---------- */
  onSubmit() {
    this.submitted = true;
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }
    console.log('FORM VALUE', this.jobForm.getRawValue());
  }

  onReset() {
    this.submitted = false;
    this.referencesFA.clear();
    this.jobForm.reset({ verifyAccountWith: 'email' });
  }
}

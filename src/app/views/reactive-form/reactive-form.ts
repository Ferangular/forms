import { Component, inject, OnInit } from '@angular/core';
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
import { map, Observable, of, switchMap, timer } from 'rxjs';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';

/* ---------- Tipos ---------- */
// ✅ Tipado estricto de los controles
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
  skills: FormRecord<FormControl<boolean>>;   // ✅ Uso de FormRecord
}

/* ---------- Validadores personalizados ---------- */
// ✅ Validador sincrónico parametrizable
function bannedWord(word: string) {
  return (c: AbstractControl): ValidationErrors | null => {
    const v = (c.value ?? '').toString().trim();
    if (!v) return null;
    return new RegExp(`\\b${word}\\b`, 'i').test(v)
      ? { bannedWordValidator: { word } }
      : null;
  };
}

// ✅ Cross-field validator a nivel de grupo
function emailsMatch(group: AbstractControl): ValidationErrors | null {
  const e = group.get('email')?.value;
  const c = group.get('confirmEmail')?.value;
  if (!e || !c) return null;            // ℹ️ no molestar si uno está vacío
  return e === c ? null : { noMatch: true };
}

/* ---------- Validador asíncrono (simulado) ---------- */
// ✅  timer + switchMap, devuelve null o error tipado
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
export class ReactiveForm implements OnInit {
  private fb = inject(FormBuilder);
  // ✅ NonNullableFormBuilder para evitar nulls en strings/booleans
// ¿Por qué preferir NonNullableFormBuilder?
//   Tipos más seguros: FormControl<string> en vez de FormControl<string | null>.
//   reset() vuelve al valor inicial ('' | false | 0…), no a null.
//   El compilador te protege de asignar null accidentalmente.
  private nfb: NonNullableFormBuilder = (this.fb as any).nonNullable ?? this.fb;

  jobForm!: FormGroup<JobForm>;
  submitted = false;

  positions = ['Frontend Developer', 'Backend Developer', 'Full-Stack', 'QA'];

  ngOnInit(): void {
    this.jobForm = this.fb.group<JobForm>(
      {
        // ✅ Grupo tipado con validaciones; override de updateOn a 'change' para first
        name: this.fb.group<NameFG>({
          first: this.nfb.control('', { validators: [Validators.required, Validators.minLength(2)], updateOn: 'change' }),
          last: this.nfb.control('', [Validators.required, Validators.minLength(2), bannedWord('Doe')]),
        }),

        // ✅ Grupo con validador de cruce y asyncValidator en 'email'
        email: this.fb.group<EmailFG>({
          email: this.nfb.control('', {
            validators: [Validators.required, Validators.email],
            asyncValidators: [checkEmailAsync()],
            updateOn: 'blur' // ℹ️ dispara el async al perder foco
          }),
          confirmEmail: this.nfb.control('') // ℹ️ puedes considerar updateOn:'change' para feedback más inmediato
        }, { validators: [emailsMatch] }),

        employmentStatus: this.fb.control<EmploymentStatus | null>(null, { validators: Validators.required }),
        positionSelected: this.fb.control<string | null>(null, { validators: Validators.required }),
        // ✅ Patrón simple para URL (http/https). Correcto para el curso.
        resumeLink: this.nfb.control('', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]),

        verifyAccountWith: this.nfb.control<'email' | 'phone number'>('email'),
        phoneNumber: this.nfb.control('', []), // ℹ️ se rellenan validadores dinámicamente

        references: this.fb.array<FormGroup<ReferenceFG>>([]),

        // ✅ FormRecord instanciado correctamente (también usar this.nfb.record({...}))
        skills: new FormRecord<FormControl<boolean>>({
          angular: this.nfb.control(false),
          react: this.nfb.control(false),
          nest: this.nfb.control(false),
        })
      },
      { updateOn: 'blur' } // ✅ estrategia global; overrides locales siguen aplicando
    );

    // ✅ Validadores dinámicos según verifyAccountWith
    // 💡 Mejora opcional:
    // import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
    // this.verifyAccountWithCtrl.valueChanges.pipe(takeUntilDestroyed()).subscribe(...)
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
  // ✅ Buenos helpers tipados
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
    // ✅ Creación tipada de un FormGroup dentro del FormArray
    const ref = this.fb.group<ReferenceFG>({
      name: this.nfb.control('', [Validators.required]),
      contact: this.nfb.control('', [Validators.required]),
    });
    this.referencesFA.push(ref);
  }
  removeReference(i: number) { this.referencesFA.removeAt(i); }

  toggleSkill(key: string) {
    // ✅ Acceso seguro al FormRecord
    const c = this.skillsRecord.controls[key];
    if (c) c.setValue(!c.value);
  }

  /* ---------- Submit & Reset ---------- */
  onSubmit() {
    this.submitted = true;
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched(); // ✅ Fuerza la visualización de errores
      return;
    }
    console.log('FORM VALUE', this.jobForm.getRawValue());
    // 💡 Mejora: podrías deshabilitar el form mientras envías y re-habilitar al finalizar.
  }

  onReset() {
    this.submitted = false;
    this.referencesFA.clear();             // ✅ Limpias FormArray
    this.jobForm.reset({ verifyAccountWith: 'email' }); // ✅ Restableces valor por defecto
    // 💡 Mejora: si quieres restaurar skills a false explícitamente, puedes iterar el FormRecord.
  }
}

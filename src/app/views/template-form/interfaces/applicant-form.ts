export interface ApplicantForm {
  name: {
    first: string;
    last: string;
  };
  email: string;
  employmentStatus: string;
  positionSelected: string;
  resumeLink: string;
  phoneNumber: string;
}

export type VerifyAccount = 'email' | 'phone number';

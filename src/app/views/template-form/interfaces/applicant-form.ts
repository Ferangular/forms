export interface ApplicantForm {
  name: {
    first: string;
    last: string;
  };
  email: string;
  employmentStatus: string;
  positionSelected: string;
  resumeLink: string
}

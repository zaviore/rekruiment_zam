import type { Candidate, JobFormField } from "@/types";

export const MOCK_CANDIDATES: Candidate[] = [
];

export const DEFAULT_JOB_FIELDS: JobFormField[] = [
  { name: 'fullName', label: 'Full name', status: 'mandatory', restrictedStatus: ['optional', 'off'] },
  { name: 'photoProfile', label: 'Photo Profile', status: 'mandatory', restrictedStatus: ['optional','off'] },
  { name: 'gender', label: 'Gender', status: 'mandatory', restrictedStatus: [] },
  { name: 'domicile', label: 'Domicile', status: 'optional', restrictedStatus: [] },
  { name: 'email', label: 'Email', status: 'mandatory', restrictedStatus: ['optional','off'] },
  { name: 'phoneNumber', label: 'Phone number', status: 'optional', restrictedStatus: [] },
  { name: 'linkedinUrl', label: 'Linkedin URL', status: 'optional', restrictedStatus: [] },
  { name: 'dateOfBirth', label: 'Date of birth', status: 'off', restrictedStatus: [] },
];

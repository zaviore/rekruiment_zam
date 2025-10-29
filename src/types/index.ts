
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export type FieldStatus = 'mandatory' | 'optional' | 'off';

export interface JobFormField {
  name: string;
  label: string;
  status: FieldStatus;
  restrictedStatus?: FieldStatus[];
}

export interface Job {
  id: string;
  jobName: string;
  jobType: string;
  description: string;
  candidatesNeeded: number;
  minSalary: number;
  maxSalary: number;
  status: 'active' | 'inactive' | 'draft';
  fields: JobFormField[];
  createdAt: Date;
}

export interface CandidateAttribute {
  key: string;
  label: string;
  value: string;
  order?: number;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  status: string;
  appliedDate: Date;
  attributes: CandidateAttribute[];
}

export interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}
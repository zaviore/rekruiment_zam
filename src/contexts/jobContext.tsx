import { createContext, useContext, useState, type ReactNode } from "react";
import type { Candidate, Job } from "@/types";
import { MOCK_CANDIDATES } from "@/mocks/candidate";

interface JobsContextType {
  jobs: Job[];
  applyForJob: (jobId: string, formData?: any) => Promise<void>;
  candidates: Candidate[];
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  getCandidatesByJobId: (jobId: string) => Candidate[];
}

const JobsContext = createContext<JobsContextType | null>(null);

export const JobsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const addJob = (job: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setJobs(prev => [...prev, newJob]);
    
    const jobCandidates = MOCK_CANDIDATES.map(c => ({
      ...c,
      id: `${newJob.id}_${c.id}`,
      jobId: newJob.id,
    }));
    setCandidates(prev => [...prev, ...jobCandidates]);
  };

  const updateJob = (id: string, updatedJob: Partial<Job>) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, ...updatedJob } : job));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
    setCandidates(prev => prev.filter(c => c.jobId !== id));
  };

  const getCandidatesByJobId = (jobId: string) => {
    return candidates.filter(c => c.jobId === jobId);
  };

  const applyForJob = async (jobId: string, formData?: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Job application submitted:", { jobId, formData });
    

    if (formData) {
      const newCandidate: Candidate = {
        id: `${jobId}_${Date.now()}`,
        jobId: jobId,
        name: formData.fullName || "Applicant",
        status: "Applied",
        appliedDate: new Date(),
        attributes: [
          { key: "full_name", label: "FULL NAME", value: formData.fullName || "" },
          { key: "email", label: "EMAIL", value: formData.email || "" },
          { key: "phone", label: "PHONE", value: formData.phone || "" },
          { key: "date_of_birth", label: "DATE OF BIRTH", value: formData.dateOfBirth || "" },
          { key: "domicile", label: "DOMICILE", value: formData.domicile || "" },
          { key: "gender", label: "GENDER", value: formData.gender || "" },
          { key: "linkedin_url", label: "LINKEDIN", value: formData.linkedinUrl || "" }
        ]
      };

      setCandidates(prev => [...prev, newCandidate]);
    }
  };

  return (
    <JobsContext.Provider value={{ jobs, candidates, addJob, updateJob, deleteJob, getCandidatesByJobId, applyForJob}}>
      {children}
    </JobsContext.Provider>
  );
};

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) throw new Error('useJobs must be used within JobsProvider');
  return context;
}
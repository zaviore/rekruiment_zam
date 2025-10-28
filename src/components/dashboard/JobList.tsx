import type { Job } from "@/types";
import jobIcon from "@/assets/Logo.svg";
import { MapPin, Wallet } from "lucide-react";

interface JobListProps {
  jobs: Job[];
  selectedJob: Job | null;
  onSelectJob: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, selectedJob, onSelectJob }) => {
  return (
    <div className="w-80">
      <div className=" rounded-xl h-full flex flex-col">
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 w-full">
            {jobs.map(job => (
              <button
                key={job.id}
                onClick={() => onSelectJob(job)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedJob?.id === job.id 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-teal-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                       <img src={jobIcon} alt="job icon" className="w-10 h-10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm mb-1 truncate">{job.jobName}</h3>
                    <p className="text-xs text-gray-600 mb-2">Rakamin</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span><MapPin className="w-4 h-4" /></span>
                        <span className="truncate">Jakarta Selatan</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span><Wallet className="w-4 h-4" /></span>
                        <span className="truncate">Rp{(job.minSalary / 1000000).toFixed(1)}M - Rp{(job.maxSalary / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
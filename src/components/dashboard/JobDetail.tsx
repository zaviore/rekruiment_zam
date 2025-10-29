import { useNavigate } from "react-router-dom";
import type { Job } from "../../types";
import jobIcon from "@/assets/Logo.svg";

interface JobDetailProps {
  selectedJob: Job | null;
  onApply: (jobId: string) => void;
  isApplying: boolean;
}

const JobDetail: React.FC<JobDetailProps> = ({ selectedJob, isApplying }) => {
  const navigate = useNavigate();
  
  if (!selectedJob) {
    return (
      <div className="bg-white rounded-xl border h-full flex items-center justify-center">
        <p className="text-gray-500">Select a job to view details</p>
      </div>
    );
  }

 
  const formatJobDescription = (description: string) => {
    if (!description) return <p className="text-gray-600">No description available</p>;
    
    const lines = description.split('\n').filter(line => line.trim());
    
    return (
      <ul className="space-y-1 text-gray-700">
        {lines.map((line, index) => {
    
          const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
          return cleanLine ? (
            <li key={index} className="flex items-start gap-2">
              <span className="text-teal-600 mt-1">•</span>
              <span>{cleanLine}</span>
            </li>
          ) : null;
        })}
      </ul>
    );
  };

  const handleApplyClick = () => {
    navigate(`/apply-job/${selectedJob.id}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-300 h-full flex flex-col">
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex gap-5">
              <img src={jobIcon} alt="job icon" className="w-14 h-14" />
            <div className="space-y-3">
              <span className="px-2 py-1 bg-[#43936C] text-white text-xs font-medium rounded">
                  {selectedJob.jobType}
                </span>
              <h2 className="text-xl font-bold">{selectedJob.jobName}</h2>
              <p className="text-sm text-gray-600">Rakamin</p>
            </div>
          </div>
          <button
            onClick={handleApplyClick}
            disabled={isApplying}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-bold transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isApplying ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>
      <hr className="mx-4 border-gray-300"/>
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="font-bold text-lg mb-4">Job Description</h3>
        {formatJobDescription(selectedJob.description)}
      </div>
    </div>
  );
};

export default JobDetail;
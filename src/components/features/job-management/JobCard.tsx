import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onManage: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onManage }) => {

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success-light border-success-border text-success";
      case "inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
            <span
              className={`p-1 md:p-2 px-2 md:px-4 rounded-md border text-xs md:text-sm font-medium ${getStatusStyles(job.status)}`}
            >
              {job.status === "active"
                ? "Active"
                : job.status === "inactive"
                ? "Inactive"
                : "Draft"}
            </span>
            <span className="text-xs md:text-sm text-gray-800 border border-gray-400 rounded-md p-1 md:p-2">
              started on {formatDate(job.createdAt)}
            </span>
          </div>
          <h3 className="text-base md:text-lg font-bold mb-1">{job.jobName}</h3>
          <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-1">
            Rp{job.minSalary.toLocaleString()} - Rp
            {job.maxSalary.toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => onManage(job)}
          className="w-full md:w-auto mt-2 md:mt-0 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium"
        >
          Manage Job
        </button>
      </div>
    </div>
  );
};

export default JobCard;
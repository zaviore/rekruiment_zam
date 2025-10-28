import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { useJobs } from "@/contexts/jobContext";
import JobList from "@/components/dashboard/JobList";
import JobDetail from "@/components/dashboard/JobDetail";
import EmptyJobComponent from "./fragments/emptyJob";
import { DashboardLayout } from "@/components";


const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { jobs, applyForJob } = useJobs();
  const navigate = useNavigate();
  const activeJobs = jobs
    .filter(job => job.status === 'active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Mengurutkan dari yang terbaru
  const [selectedJob, setSelectedJob] = useState(activeJobs.length > 0 ? activeJobs[0] : null);
  const [isApplying, setIsApplying] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleApply = async (jobId: string) => {
    setIsApplying(true);
    try {
      await applyForJob(jobId);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      title="Job Portal"
      iconColor="text-green-600"
    >
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {activeJobs.length === 0 ? (
          <EmptyJobComponent 
            title="No job openings available"
            description="Please wait for the next batch of openings."
          />
        ) : (
          <div className="flex gap-6 h-[calc(100vh-180px)]">
            <JobList 
              jobs={activeJobs} 
              selectedJob={selectedJob} 
              onSelectJob={setSelectedJob} 
            />
            <div className="flex-1">
              <JobDetail 
                selectedJob={selectedJob} 
                onApply={handleApply} 
                isApplying={isApplying} 
              />
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
};

export default UserDashboard;
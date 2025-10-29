import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import { useAuth } from "@/contexts/authContext";
import { ManageCandidate } from "@/components/features/candidate-management";
import { SearchBar } from "@/components/shared/ui";
import { CreateJobModal, EmptyJobComponent, JobCard, AddJobSection } from "@/components/features/job-management";
import { useJobManagement } from "@/hooks/useJobManagement";
import { ChevronRight } from "lucide-react";

const AdminDashboard: React.FC = () => {
 
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    jobs,
    searchQuery,
    setSearchQuery,
    selectedJob,
    setSelectedJob,
    showCreateModal,
    toggleCreateModal,
    handleManageJob
  } = useJobManagement();


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (selectedJob) {
    return (
      <DashboardLayout
        user={user}
        onLogout={handleLogout}
        title={
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSelectedJob(null)}
              className="text-gray-700 border border-neutral-300 shadow hover:bg-neutral-100 text-base rounded-md px-3 py-1 hover:text-gray-900 font-medium"
            >
              Job List
            </button>
            <span className="text-gray-500"><ChevronRight/></span>
            <span className="text-gray-900 text-base font-medium bg-neutral-300 py-1 px-3 border rounded-md border-neutral-400">
              Manage Candidate
            </span>
          </div>
        }
        iconColor="text-indigo-600"
      >
       
          <ManageCandidate
            job={selectedJob}
            onBack={() => setSelectedJob(null)}
          />

      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      title="Job List"
      iconColor="text-indigo-600"
    >
      <div className="mb-6 flex gap-4">
        <div className="w-full space-y-5">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by job details"
          />
          
          <div>
            {jobs.length === 0 ? (
              <EmptyJobComponent 
                isButtonVisible={true}
                onCreateJob={() => toggleCreateModal(true)}
                title="No job openings available"
                description="Please create a new job to start recruiting candidates."
              />
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onManage={handleManageJob}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
    
        <AddJobSection
          title="Recruit the best candidates"
          subtitle="Create jobs, invite, and hire with ease"
          buttonText="Create a new job"
          onButtonClick={() => toggleCreateModal(true)}
          backgroundImage="/src/assets/createJobImg.jpg"
        />
      </div>


      {showCreateModal && (
        <CreateJobModal onClose={() => toggleCreateModal(false)} />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;

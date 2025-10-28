import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "@/contexts/jobContext";
import { ApplyJobForm } from "./fragments";

const ApplyJobPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, applyForJob } = useJobs();
  const navigate = useNavigate();
  
  const selectedJob = jobs.find(job => job.id === jobId);
  
  const handleSubmit = async (formData: any) => {
    try {
      const applicationData = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        domicile: formData.domicile,
        phone: formData.phoneNumber,
        photoProfile: formData.photoProfile,
        email: formData.email,
        linkedinUrl: formData.linkedinUrl
      };
      
      await applyForJob(jobId as string, applicationData);
      alert("Application submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };
  
  if (!selectedJob) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Job not found. <button onClick={() => navigate("/dashboard")} className="text-blue-500 underline">Return to dashboard</button></p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ApplyJobForm 
        jobTitle={selectedJob.jobName} 
        job={selectedJob}
        onSubmit={handleSubmit} 
      />
    </div>
  );
};

export default ApplyJobPage;
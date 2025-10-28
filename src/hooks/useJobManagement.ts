import { useState, useEffect, useCallback } from "react";
import { useJobs } from "@/contexts/jobContext";
import type { Job } from "@/types";
import { debounce } from "@/utils/debounce";


export const useJobManagement = () => {
  const { jobs } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const debouncedSetSearchQuery = useCallback(
    debounce((value: string) => {
      setDebouncedSearchQuery(value);
    }, 300),
    []
  );


  useEffect(() => {
    debouncedSetSearchQuery(searchQuery);
  }, [searchQuery, debouncedSetSearchQuery]);


  const filteredJobs = jobs
    .filter((job) => job.jobName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Mengurutkan dari yang terbaru


  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };


  const handleManageJob = (job: Job) => {
    setSelectedJob(job);
  };  

  const toggleCreateModal = (isOpen: boolean) => {
    setShowCreateModal(isOpen);
  };

  return {
    jobs: filteredJobs,
    searchQuery,
    setSearchQuery,
    selectedJob,
    setSelectedJob,
    showCreateModal,
    toggleCreateModal,
    handleManageJob,
    formatDate,
  };
};
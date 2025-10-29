import React from "react";
import { X } from "lucide-react";
import { useJobs } from "@/contexts/jobContext";
import type { Job } from "@/types";
import { useState } from "react";
import { CustomCheckbox } from "@/components/shared/ui";
import emptyCandidateImg from "@/assets/empty_candidate.svg";
import dayjs from "dayjs";

const ManageCandidate: React.FC<{ job: Job; onBack: () => void }> = ({ job }) => {
  const { getCandidatesByJobId } = useJobs();
  const candidates = getCandidatesByJobId(job.id);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const headers = candidates.length > 0 
    ? candidates[0].attributes.map(attr => attr.label)
    : [];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map(c => c.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectCandidate = (id: string) => {
    if (selectedCandidates.includes(id)) {
      setSelectedCandidates(selectedCandidates.filter(cId => cId !== id));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedCandidates, id];
      setSelectedCandidates(newSelected);
      if (newSelected.length === candidates.length) {
        setSelectAll(true);
      }
    }
  };

  return (
    <div className="space-y-6 px-5">
      <div className="">
        <h2 className="text-xl font-bold">{job.jobName}</h2>
      </div>
      <div className="border border-neutral-300 rounded-md p-4"> 
        {candidates.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto relative">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <CustomCheckbox 
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    {headers.map((header, idx) => (
                      <th 
                        key={idx}
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${idx === 0 ? 'sticky left-[3rem] z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <tr 
                      key={candidate.id} 
                      className={`hover:bg-gray-50 transition ${
                        selectedCandidates.includes(candidate.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 sticky left-0 z-20 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        <CustomCheckbox 
                          checked={selectedCandidates.includes(candidate.id)}
                          onChange={() => handleSelectCandidate(candidate.id)}
                        />
                      </td>
                      {candidate.attributes.map((attr, idx) => (
                        <td 
                          key={idx}
                          className={`px-6 py-4 text-sm text-gray-900 whitespace-nowrap ${idx === 0 ? 'sticky left-[3rem] z-20 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}`}
                        >
                          {!attr.value ? (
                            "-"
                          ) : attr.key === 'linkedin_link' || attr.key === 'linkedin_url' ? (
                            <a 
                              href={attr.value} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {attr.value.length > 40 ? attr.value.substring(0, 40) + '...' : attr.value}
                            </a>
                          ) : attr.key === 'date_of_birth' ? (
                            dayjs(attr.value).format('DD MMMM YYYY')
                          ) : (
                            attr.value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <img src={emptyCandidateImg} alt="No candidates" className="w-64 h-64 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No candidates yet</h3>
            <p className="text-gray-500 text-center max-w-md">
              Candidates will appear here after they apply for this job position.
            </p>
          </div>
        )}
      </div>

      {selectedCandidates.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4">
          <span className="font-medium">{selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''} selected</span>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-white text-indigo-600 rounded hover:bg-gray-100 text-sm font-medium">
              Shortlist
            </button>
            <button className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-400 rounded text-sm font-medium">
              Send Email
            </button>
            <button className="px-4 py-1.5 bg-red-500 hover:bg-red-400 rounded text-sm font-medium">
              Reject
            </button>
          </div>
          <button 
            onClick={() => {
              setSelectedCandidates([]);
              setSelectAll(false);
            }}
            className="text-white hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageCandidate;
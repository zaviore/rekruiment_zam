import { useState, useEffect } from "react";
import { useJobs } from "@/contexts/jobContext";
import type { FieldStatus, JobFormField } from "@/types";
import { DEFAULT_JOB_FIELDS } from "@/mocks/candidate";
import { X } from "lucide-react";
import { validateJobForm } from "@/utils/validation";
import { toast } from "react-toastify";

const CreateJobModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addJob } = useJobs();
  const [formData, setFormData] = useState({
    jobName: '',
    jobType: '',
    description: '',
    candidatesNeeded: 1,
    minSalary: 0,
    maxSalary: 0,
    status: 'active' as const,
  });
  const [fields, setFields] = useState<JobFormField[]>(DEFAULT_JOB_FIELDS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const validation = validateJobForm(formData);
    if (!validation.success) {
      setErrors(validation.errors);
      setIsFormValid(false);
      return false;
    }
    

    if (!formData.jobName.trim() || !formData.jobType.trim() || !formData.description.trim()) {
      const newErrors: Record<string, string> = {};
      
      if (!formData.jobName.trim()) {
        newErrors.jobName = 'Nama job harus diisi';
      }
      
      if (!formData.jobType.trim()) {
        newErrors.jobType = 'Tipe job harus diisi';
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Deskripsi job harus diisi';
      }
  
      setErrors(newErrors);
      setIsFormValid(false);
      return false;
    }
    
    setErrors({});
    setIsFormValid(true);
    return true;
  };

  const updateFieldStatus = (fieldName: string, status: FieldStatus) => {
    setFields(prev => prev.map(f => f.name === fieldName ? { ...f, status } : f));
  };

  const handleSubmit = () => {
 
    if (!validateForm()) {
      console.log("Form validation failed on submit"); 
      return;
    }
    
    addJob({ 
      ...formData, 
      candidatesNeeded: Number(formData.candidatesNeeded),
      minSalary: Number(formData.minSalary),
      maxSalary: Number(formData.maxSalary),
      fields 
    });
    toast.success("Job vacancy successfully created");
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({...formData, [field]: value});

    if (errors[field]) {
      const newErrors = {...errors};
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <div className="bg-white rounded-xl w-full max-w-2xl my-8 flex flex-col max-h-[calc(100vh-7rem)]">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold">Job Opening</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium mb-2">Job Name*</label>
            <input
              type="text"
              value={formData.jobName}
              onChange={(e) => handleInputChange('jobName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.jobName ? 'border-red-500' : ''}`}
              placeholder="Ex. Front End Engineer"
            />
            {errors.jobName && <p className="text-red-500 text-xs mt-1">{errors.jobName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Type*</label>
            <select
              value={formData.jobType}
              onChange={(e) => handleInputChange('jobType', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.jobType ? 'border-red-500' : ''}`}
            >
              <option value="">Select job type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
            {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Description*</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.description ? 'border-red-500' : ''}`}
              rows={6}
              placeholder="Masukkan deskripsi pekerjaan secara detail. Contoh:
• Develop, test, and maintain responsive web applications
• Collaborate with UI/UX designers
• Integrate front-end components with APIs
• Ensure cross-browser compatibility
• Write clean, reusable code
• Participate in code reviews"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            <p className="text-xs text-gray-500 mt-1">Gunakan format bullet point dengan simbol • untuk setiap poin deskripsi pekerjaan</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number of Candidate Needed*</label>
            <input
              type="number"
              value={formData.candidatesNeeded}
              onChange={(e) => handleInputChange('candidatesNeeded', parseInt(e.target.value) || 1)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.candidatesNeeded ? 'border-red-500' : ''}`}
              placeholder="Ex. 2"
            />
            {errors.candidatesNeeded && <p className="text-red-500 text-xs mt-1">{errors.candidatesNeeded}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Salary</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600">Minimum Estimated Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-2">Rp</span>
                  <input
                    type="text"
                    value={formData.minSalary ? formData.minSalary.toLocaleString('id-ID').replace(/,/g, '.') : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleInputChange('minSalary', value ? parseInt(value) : 0);
                    }}
                    className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.minSalary ? 'border-red-500' : ''}`}
                    placeholder="2.000.000"
                  />
                </div>
                {errors.minSalary && <p className="text-red-500 text-xs mt-1">{errors.minSalary}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Maximum Estimated Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-2">Rp</span>
                  <input
                    type="text"
                    value={formData.maxSalary ? formData.maxSalary.toLocaleString('id-ID').replace(/,/g, '.') : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleInputChange('maxSalary', value ? parseInt(value) : 0);
                    }}
                    className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.maxSalary ? 'border-red-500' : ''}`}
                    placeholder="9.000.000"
                  />
                </div>
                {errors.maxSalary && <p className="text-red-500 text-xs mt-1">{errors.maxSalary}</p>}
              </div>
            </div>
          </div>

          <div className="border border-neutral-200 rounded-xl p-5 mt-4">
            <label className="block text-sm font-medium mb-3">Minimum Profile Information Required</label>
            <div className="space-y-3 p-4">
              {fields.map((field, arr) => (
                <div key={field.name}>
                   <div key={field.name} className={`flex items-center justify-between py-2 `}> 
                  <span className="text-sm">{field.label}</span>
                  <div className="flex gap-2">
                    {(['mandatory', 'optional', 'off'] as FieldStatus[]).map(status => {
                      const isRestricted = field.restrictedStatus?.includes(status) || false;
                      return (
                        <button
                          key={status}
                          onClick={() => !isRestricted && updateFieldStatus(field.name, status)}
                          className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                            field.status === status
                              ? "border-[#01959F] border text-[#01959F]"
                              : isRestricted 
                                ? 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed opacity-50' 
                                : 'bg-white border text-gray-600 hover:bg-gray-50'
                          }`}
                          disabled={isRestricted}
                        >
                          {status === 'mandatory' ? 'Mandatory' : status === 'optional' ? 'Optional' : 'Off'}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className={arr < fields.length - 1 ? 'border-b border-neutral-200' : ''} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end rounded-b-xl">
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 ${isFormValid ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-gray-300 cursor-not-allowed'} text-white rounded-lg font-medium`}
            disabled={!isFormValid}
          >
            Publish Job
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateJobModal;
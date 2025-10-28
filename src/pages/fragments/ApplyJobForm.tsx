import { useState } from "react";
import { ArrowLeft, Calendar, ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type Job, type FieldStatus } from "../../types";
import FingerVerification from "../../components/ui/FingerVerification";

interface ApplyJobFormProps {
  jobTitle: string;
  job: Job;
  onSubmit: (formData: any) => void;
  isSubmitting?: boolean;
}

const ApplyJobForm: React.FC<ApplyJobFormProps> = ({ jobTitle, job, onSubmit, isSubmitting = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    photoProfile: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    domicile: "",
    phoneNumber: "",
    email: "",
    linkedinUrl: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showFingerVerification, setShowFingerVerification] = useState<boolean>(false);
  
  const getFieldStatus = (fieldName: string): FieldStatus => {
    const field = job.fields.find(f => f.name === fieldName);
    return field?.status || 'mandatory';
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.photoProfile) {
      newErrors.photoProfile = "Foto profil wajib diisi";
    }

    if (getFieldStatus('fullName') === 'mandatory' && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (getFieldStatus('dateOfBirth') === 'mandatory' && !formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    
    if (getFieldStatus('gender') === 'mandatory' && !formData.gender) {
      newErrors.gender = "Gender is required";
    }
    
    if (getFieldStatus('domicile') === 'mandatory' && !formData.domicile.trim()) {
      newErrors.domicile = "Domicile is required";
    }
    
    if (getFieldStatus('phoneNumber') === 'mandatory' && !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    
    if (getFieldStatus('email') === 'mandatory') {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    } else if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (getFieldStatus('linkedinUrl') === 'mandatory') {
      if (!formData.linkedinUrl.trim()) {
        newErrors.linkedinUrl = "LinkedIn URL is required";
      } else if (!formData.linkedinUrl.includes('linkedin.com')) {
        newErrors.linkedinUrl = "Please enter a valid LinkedIn URL";
      }
    } else if (formData.linkedinUrl && !formData.linkedinUrl.includes('linkedin.com')) {
      newErrors.linkedinUrl = "Please enter a valid LinkedIn URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    
   
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const shouldRenderField = (fieldName: string): boolean => {
    const status = getFieldStatus(fieldName);
    return status !== 'off';
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <button 
          onClick={() => navigate(-1)}
          className="mr-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-medium">Apply {jobTitle} at Rakamin</h1>
      </div>
      
      <div className="bg-blue-50 p-2 rounded-md mb-6 text-xs text-blue-700 flex items-center">
        <span className="mr-1">🛈</span>
        This field required to fill
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {shouldRenderField('photoProfile') && (
          <div>
            {getFieldStatus('photoProfile') === 'mandatory' && (
              <div className="text-red-500 text-xs mb-1">* Required</div>
            )}
            <label className="block text-sm mb-1">Photo Profile</label>
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center mb-2 overflow-hidden">
                {formData.photoProfile ? (
                  <img 
                    src={formData.photoProfile} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-teal-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => setShowFingerVerification(true)}
                className="text-xs text-teal-600 font-medium"
              >
                Take a Picture
              </button>
              
              {errors.photoProfile && (
                <div className="text-red-500 text-xs mt-1">{errors.photoProfile}</div>
              )}
              
              {showFingerVerification && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg max-w-xl w-full">
                    <div className="flex justify-between items-center">
                      <div>
                           <h3 className="text-lg font-medium">Raise Your Hand to Capture </h3>
                            <p className="text-sm">We’ll take the photo once your hand pose is detected.</p>
                      </div>
                      <div> 
                    <div
                      id="closeFingerVerification"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
         
                        if ((window as any).stopFingerVerificationCamera) {
                          (window as any).stopFingerVerificationCamera();
                        }
                        
                        try {
                          navigator.mediaDevices.getUserMedia({ audio: false, video: true })
                            .then(stream => {
                              stream.getTracks().forEach(track => {
                                track.stop();
                                console.log("Force stopped track from close button:", track.kind);
                              });
                            });
                        } catch (err) {
                          console.log("No additional tracks to stop");
                        }
                        
                        // Hentikan semua media tracks yang aktif
                        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                          navigator.mediaDevices.enumerateDevices()
                            .then(devices => {
                              devices.forEach(device => {
                                if (device.kind === 'videoinput') {
                                  console.log("Attempting to stop video device:", device.label);
                                }
                              });
                            });
                        }
  
                        setShowFingerVerification(false);
                      }}
                      className="w-full py-2 text-gray-800 rounded-md cursor-pointer "
                    >
                      <X size={18} />
                    </div></div>
                 
                    </div>
                    <FingerVerification 
                      onComplete={(photoData) => {
                        setFormData({...formData, photoProfile: photoData});
                        setShowFingerVerification(false);

                        if (errors.photoProfile) {
                          const newErrors = { ...errors };
                          delete newErrors.photoProfile;
                          setErrors(newErrors);
                        }
                      }}
                    />
                   
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {shouldRenderField('fullName') && (
          <div>
            {getFieldStatus('fullName') === 'mandatory' && (
              <div className="text-red-500 text-xs mb-1">* Required</div>
            )}
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>
        )}
        
        {shouldRenderField('dateOfBirth') && (
          <div>
            {getFieldStatus('dateOfBirth') === 'mandatory' && (
              <div className="text-red-500 text-xs mb-1">* Required</div>
            )}
            <label className="block text-sm mb-1">Date of Birth</label>
            <div className="relative">
              <input
                type="text"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                placeholder="Select date of birth"
                className={`w-full px-3 py-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md pr-10`}
                onFocus={(e) => (e.target as HTMLInputElement).type = "date"}
                onBlur={(e) => {
                  if (!(e.target as HTMLInputElement).value) {
                    (e.target as HTMLInputElement).type = "text";
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Calendar size={16} />
              </div>
            </div>
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>
        )}
        
        {shouldRenderField('gender') && (
          <div>
            {getFieldStatus('gender') === 'mandatory' && (
              <div className="text-red-500 text-xs mb-1">* Required</div>
            )}
            <label className="block text-sm mb-1">Gender</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="mr-2 accent-teal-600"
                />
                <span className="text-sm">She/her (Female)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="mr-2 accent-teal-600"
                />
                <span className="text-sm">He/him (Male)</span>
              </label>
            </div>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
        )}
        
        {shouldRenderField('domicile') && (
          <div>
            {getFieldStatus('domicile') === 'mandatory' && (
              <div className="text-red-500 text-xs mb-1">* Required</div>
            )}
            <label className="block text-sm mb-1">Domicile</label>
            <div className="relative">
              <select
                value={formData.domicile}
                onChange={(e) => handleInputChange("domicile", e.target.value)}
                className={`w-full px-3 py-2 border ${errors.domicile ? 'border-red-500' : 'border-gray-300'} rounded-md appearance-none`}
              >
                <option value="">Choose your domicile</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Bandung">Bandung</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Bali">Bali</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>
            {errors.domicile && <p className="text-red-500 text-xs mt-1">{errors.domicile}</p>}
          </div>
        )}
        
        {shouldRenderField('email') && (
          <div>
            {getFieldStatus('email') === 'mandatory' && (
              <div className="text-red-500 text-xs mb-1">* Required</div>
            )}
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              placeholder="Enter your email address"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        )}
        
        {shouldRenderField('linkedinUrl') && (
          <div>
            {getFieldStatus('linkedinUrl') === 'mandatory' && (
              <div className="text-red-500 text-xs mb-1">* Required</div>
            )}
            <label className="block text-sm mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              className={`w-full px-3 py-2 border ${errors.linkedinUrl ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            {errors.linkedinUrl && <p className="text-red-500 text-xs mt-1">{errors.linkedinUrl}</p>}
          </div>
        )}
        
        {shouldRenderField('phoneNumber') && (
          <div>
            {getFieldStatus('phoneNumber') === 'mandatory' && (
              <div className="text-red-500 text-xs mb-1">* Required</div>
            )}
            <label className="block text-sm mb-1">Phone number</label>
            <div className="flex">
              <div className="bg-gray-100 border border-gray-300 rounded-l-md px-3 py-2 flex items-center text-sm">
                <span className="text-red-500 mr-1">*</span>
                +62
              </div>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="81XXXXXXXX"
                className={`flex-1 px-3 py-2 border-t border-r border-b ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-r-md`}
              />
            </div>
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-teal-600 text-white py-3 rounded-md font-medium hover:bg-teal-700 transition-colors disabled:bg-teal-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ApplyJobForm;
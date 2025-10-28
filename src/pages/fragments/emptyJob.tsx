import EmptyImage from "@/assets/artwork.png";

interface EmptyJobComponentProps {
  isButtonVisible?: boolean;
  onCreateJob?: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

function EmptyJobComponent({
  isButtonVisible = false, 
  onCreateJob,
  title = "No job openings available",
  description = "Create a job opening now and start the candidate process.",
  buttonText = "Create a new job"
}: EmptyJobComponentProps) {
  return (
     <div className="rounded-xl p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="mb-6">
                <img src={EmptyImage} alt="Empty Job Artwork" className="w-72 h-72 mx-auto" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600 mb-6">{description}</p>
              {isButtonVisible && (
                <button
                onClick={onCreateJob}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium inline-flex items-center gap-2"
              >
                {buttonText}
              </button>
              )}
            </div>
          </div>
  )
}

export default EmptyJobComponent
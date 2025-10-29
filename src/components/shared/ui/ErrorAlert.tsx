import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ErrorAlert;
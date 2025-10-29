import { LogOutIcon } from "lucide-react";

const DashboardLayout: React.FC<any> = ({
  user,
  onLogout,
  children,
  title,
}) => {

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            <div className={`${typeof title === 'string' ? 'text-xl font-bold text-gray-900' : ''}`}>
              {title}
            </div>
          </div>
  
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={onLogout}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <span className="sr-only">Logout</span>
             <LogOutIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
      </nav>
      <main className="mx-auto px-4 py-6">{children}</main>
    </div>
  );
};
export default DashboardLayout
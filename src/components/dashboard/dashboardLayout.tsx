// import type { DashboardLayoutProps } from "../../types";

const DashboardLayout: React.FC<any> = ({
  user,
  onLogout,
  children,
  title
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
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
        </div>
      </nav>
      <main className="mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
export default DashboardLayout
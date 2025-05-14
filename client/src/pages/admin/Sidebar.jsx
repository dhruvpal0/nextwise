import { ChartNoAxesColumn, SquareLibrary } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

const Sidebar = () => {    
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}  
      {/* bg-[#f9f9f9] dark:bg-[#1f1f1f]  */}
      <aside className="hidden lg:flex flex-col w-[250px] border-r   pt-20 px-4"> 
        <nav className="space-y-4">
          <Link
          defaultValue={"Dashboard"}
            to="dashboard"
            className="flex items-center gap-3 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
          >
            <ChartNoAxesColumn size={22} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="course"
            className="flex items-center gap-3 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
          >
            <SquareLibrary size={22} />
            <span>Courses</span>
          </Link>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 w-full pt-20 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;

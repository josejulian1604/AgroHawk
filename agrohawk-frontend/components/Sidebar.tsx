import { FaFolderOpen, FaWrench } from "react-icons/fa";

type Props = {
  open: boolean;
}

export default function Sidebar({ open }: Props) {
  function SidebarButton({ label, icon, active = false }: { label: string; icon: React.ReactNode; active?: boolean }) {
    return (
      <button
        className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-all duration-200 ${
          active ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <aside
      className={`
        fixed lg:static top-0 left-0 z-40 bg-gray-100 p-4 border-r shadow-lg min-h-screen lg:min-h-0 
        lg:h-auto w-64 transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <nav className="space-y-4 mt-16 lg:mt-0">
        <div className="space-y-2">
          <SidebarButton label="Documentos" icon={<FaFolderOpen />} active />
        </div>
      </nav>
    </aside>
  );
}

import { FaFolderOpen, FaWrench } from "react-icons/fa";

export default function Sidebar() {
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
    <aside className="min-h-screen w-64 bg-gray-100 p-4 border-r shadow-lg">
      <nav className="space-y-4 mt-16 lg:mt-0">
        <div className="space-y-2">
          <SidebarButton label="Documentos" icon={<FaFolderOpen />} active />
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="space-y-2">
          <SidebarButton label="Configuración" icon={<FaWrench />} />
        </div>
      </nav>
    </aside>
  );
}

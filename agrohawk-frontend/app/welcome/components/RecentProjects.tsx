type Project = {
    image: string;
    title: string;
    description: string;
  };
  
  const projects: Project[] = [
    {
      image: "/proyectos/san-carlos.jpeg",
      title: "Fumigación de cultivos en San Carlos",
      description: "Aplicación de fertilizantes en campos extensivos mediante drones de alta capacidad.",
    },
    {
      image: "/proyectos/sarapiqui.jpg",
      title: "Monitoreo en Sarapiquí",
      description: "Inspección aérea de cultivos de banano y caña para evaluar el estado de crecimiento.",
    },
    {
      image: "/proyectos/fitosanitarios.jpg",
      title: "Aplicación de productos fitosanitarios",
      description: "Fumigación precisa para proteger cultivos de enfermedades y plagas.",
    },
    {
      image: "/proyectos/guanacaste.jpg",
      title: "Riego y monitoreo en Guanacaste",
      description: "Supervisión del riego en cultivos mediante drones, optimizando el uso del agua.",
    },
  ];
  
  export default function RecentProjects() {
    return (
      <section className="bg-white text-black py-20 px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Proyectos Recientes
        </h2>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-md bg-gray-100 hover:shadow-lg transition-shadow duration-300">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover md:h-72"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-sm text-gray-700 mt-1">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
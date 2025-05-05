import {
  Leaf,
  Landmark,
  BarChart3,
  Bug,
  BadgeHelp,
  HandCoins,
} from "lucide-react";
import type { JSX } from "react";

type Service = {
  icon: JSX.Element;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: <Leaf size={32} />,
    title: "Fumigación de Cultivos",
    description:
      "Aplicamos fertilizantes y pesticidas de manera precisa mediante drones, optimizando la protección y nutrición de tus cultivos.",
  },
  {
    icon: <Landmark size={32} />,
    title: "Mapeo de Terrenos",
    description:
      "Realizamos mapas detallados y actualizados de tus terrenos agrícolas para mejorar la planificación y gestión de cultivos.",
  },
  {
    icon: <BarChart3 size={32} />,
    title: "Análisis de Cultivo",
    description:
      "Evaluamos el estado de salud de las plantas a través de imágenes aéreas multiespectrales para una toma de decisiones más informada.",
  },
  {
    icon: <Bug size={32} />,
    title: "Detección de Plagas",
    description:
      "Identificamos signos tempranos de plagas o enfermedades mediante inspecciones aéreas, permitiendo intervenciones rápidas y efectivas.",
  },
  {
    icon: <BadgeHelp size={32} />,
    title: "Consultoría",
    description:
      "Asesoramos a tu empresa en la implementación de tecnología aérea para optimizar la producción agrícola.",
  },
  {
    icon: <HandCoins size={32} />,
    title: "Cotizaciones",
    description:
      "Contáctanos para recibir una propuesta adaptada a las necesidades de tu terreno y tipo de cultivo.",
  },
];

export default function OurServices() {
  return (
    <section className="bg-white text-black py-20 px-6 md:px-12 lg:px-24">
      <p className="text-center text-teal-400 text-lg font-semibold mb-2">
        Nuestros Servicios
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 leading-snug">
        Innovación aérea <br className="hidden md:block" />
        al servicio del sector agrícola
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-gray-100 hover:bg-black hover:text-white transition-colors duration-300 rounded-xl p-6 shadow-md"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full mb-4">
              {service.icon}
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {service.title}
            </h3>
            <p className="text-sm leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

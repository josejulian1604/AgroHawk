import React from "react";

interface CardProps {
  title: string;
  description: string | string[];
  image: string;
  reversed?: boolean;
  bgDark?: boolean;
}

const InfoCard: React.FC<CardProps> = ({ title, description, image, reversed = false, bgDark = false }) => {
  return (
    <div
      className={`flex flex-col md:flex-row ${reversed ? "md:flex-row-reverse" : ""} rounded-xl overflow-hidden shadow-md ${
        bgDark ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="md:w-1/2 p-6 space-y-3 flex flex-col justify-center">
        <h3 className={`text-xl font-semibold ${bgDark ? "text-teal-300" : "text-teal-500"}`}>{title}</h3>
        {Array.isArray(description) ? (
          <ul className="list-disc list-inside space-y-1">
            {description.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        ) : (
          <p>{description}</p>
        )}
      </div>
      <div className="md:w-1/2">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default function AboutUs() {
  return (
    <section id="acerca" className="py-16 px-6 max-w-6xl mx-auto text-center bg-white ">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-teal-500">Acerca de Nosotros</h2>

      <div className="space-y-10">
        <InfoCard
          title="¿Quiénes Somos?"
          description="Somos una empresa especializada en fumigación, monitoreo y análisis agrícola utilizando drones de última generación. Nuestro compromiso es brindar soluciones eficientes, sostenibles y precisas para impulsar el éxito de nuestros clientes."
          image="/about/about1.jpeg"
          bgDark
        />
        <InfoCard
          title="Nuestra Misión"
          description="Nuestra misión es optimizar los procesos agrícolas mediante innovación tecnológica, cuidando los cultivos y el medio ambiente."
          image="/about/about2.jpeg"
        />
        <InfoCard
          title="Nuestra Experiencia"
          description={[
            "+5 años de experiencia",
            "+1200 hectáreas fumigadas",
            "+50 clientes satisfechos",
          ]}
          image="/about/about3.png"
          bgDark
        />
      </div>
    </section>
  );
}

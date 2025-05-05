import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const videos = [
  { src: "/video1.mp4", alt: "Video 1" },
  { src: "/video2.mp4", alt: "Video 2" },
  { src: "/video3.mp4", alt: "Video 3" },
];

export default function VideoGallery() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((current - 1 + videos.length) % videos.length);
  const next = () => setCurrent((current + 1) % videos.length);

  return (
    <section className="bg-[#0a0f1a] text-white py-16 px-6 text-center">
      <p className="text-teal-400 font-semibold text-sm mb-2">Tecnología en el Campo</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-10">
        Conoce nuestros servicios en video
      </h2>

      <div className="relative max-w-5xl mx-auto">
        {/* Flechas */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-2 z-10 shadow hover:bg-gray-100"
          aria-label="Anterior"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-2 z-10 shadow hover:bg-gray-100"
          aria-label="Siguiente"
        >
          <ChevronRight size={24} />
        </button>

        {/* Video */}
        <div className="overflow-hidden rounded-xl shadow-lg">
          <video
            key={videos[current].src}
            src={videos[current].src}
            className="w-full h-auto max-h-[500px] object-cover rounded-xl"
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        </div>

        {/* Puntos de navegación */}
        <div className="flex justify-center mt-6 space-x-2">
          {videos.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${
                current === idx ? "bg-teal-400" : "bg-gray-500"
              }`}
              onClick={() => setCurrent(idx)}
              aria-label={`Video ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

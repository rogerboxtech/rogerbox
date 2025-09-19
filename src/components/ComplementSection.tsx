'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Clock, Calendar, Sparkles } from 'lucide-react';

interface Complement {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  date: string;
  isNew: boolean;
  category: string;
}

const complements: Complement[] = [
  {
    id: '1',
    title: 'Estiramiento Matutino',
    description: 'Rutina de 10 minutos para empezar el día con energía',
    thumbnail: '/images/complemento-1.jpg',
    duration: '10 min',
    date: '2024-01-15',
    isNew: true,
    category: 'Flexibilidad'
  },
  {
    id: '2',
    title: 'Respiración Profunda',
    description: 'Técnicas de respiración para relajación y concentración',
    thumbnail: '/images/complemento-2.jpg',
    duration: '8 min',
    date: '2024-01-14',
    isNew: false,
    category: 'Relajación'
  },
  {
    id: '3',
    title: 'Calentamiento Dinámico',
    description: 'Prepara tu cuerpo antes de cualquier entrenamiento',
    thumbnail: '/images/complemento-3.jpg',
    duration: '12 min',
    date: '2024-01-13',
    isNew: false,
    category: 'Calentamiento'
  },
  {
    id: '4',
    title: 'Recuperación Activa',
    description: 'Ejercicios suaves para acelerar la recuperación',
    thumbnail: '/images/complemento-4.jpg',
    duration: '15 min',
    date: '2024-01-12',
    isNew: false,
    category: 'Recuperación'
  },
  {
    id: '5',
    title: 'Meditación Guiada',
    description: 'Sesión de meditación para reducir el estrés',
    thumbnail: '/images/complemento-5.jpg',
    duration: '20 min',
    date: '2024-01-11',
    isNew: false,
    category: 'Bienestar'
  },
  {
    id: '6',
    title: 'Movilidad Articular',
    description: 'Mejora la movilidad de tus articulaciones',
    thumbnail: '/images/complemento-6.jpg',
    duration: '18 min',
    date: '2024-01-10',
    isNew: false,
    category: 'Movilidad'
  }
];

export default function ComplementSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(complements.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(complements.length / 3)) % Math.ceil(complements.length / 3));
  };

  const visibleComplements = complements.slice(currentIndex * 3, (currentIndex + 1) * 3);

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center space-x-2 mb-2">
          <Sparkles className="w-6 h-6 text-[#85ea10]" />
          <span>Complementos</span>
        </h3>
        <p className="text-white/60 text-sm">
          Nuevo contenido diario
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          disabled={currentIndex >= Math.ceil(complements.length / 3) - 1}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Cards Container */}
        <div className="flex space-x-6 overflow-hidden">
          {visibleComplements.map((complement) => (
            <div
              key={complement.id}
              className="flex-shrink-0 w-72 bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-[#85ea10]/50 transition-all duration-300 transform hover:scale-105"
              onMouseEnter={() => setHoveredCard(complement.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-[9/16] bg-gradient-to-br from-[#85ea10]/20 to-[#7dd30f]/20">
                {/* Placeholder for vertical video */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#85ea10] rounded-full flex items-center justify-center opacity-80">
                    <Play className="w-8 h-8 text-black ml-1" />
                  </div>
                </div>

                {/* New Badge */}
                {complement.isNew && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-[#85ea10] to-[#7dd30f] text-black px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>NUEVO</span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#29839c] to-[#164151] backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg border border-white/20">
                  {complement.category}
                </div>

                {/* Duration */}
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#164151] to-[#29839c] backdrop-blur-sm text-white px-3 py-2 rounded-full text-xs font-medium flex items-center space-x-1 shadow-lg border border-white/20">
                  <Clock className="w-3 h-3" />
                  <span>{complement.duration}</span>
                </div>

                {/* Hover Overlay */}
                {hoveredCard === complement.id && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-20 h-20 bg-[#85ea10] rounded-full flex items-center justify-center opacity-90">
                      <Play className="w-10 h-10 text-black ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="text-white font-bold text-lg mb-2 line-clamp-2">
                  {complement.title}
                </h4>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">
                  {complement.description}
                </p>
                
                {/* Date */}
                <div className="flex items-center space-x-2 text-white/50 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(complement.date).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long' 
                  })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: Math.ceil(complements.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-[#85ea10] w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center mt-6">
        <button className="text-[#85ea10] hover:text-[#7dd30f] font-medium text-sm transition-colors duration-300">
          Ver todos los complementos →
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Clock, User, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { Blog } from '@/types';

interface NutritionalBlogsProps {
  blogs: Blog[];
}

export default function NutritionalBlogs({ blogs }: NutritionalBlogsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const categories = [
    { id: 'all', name: 'Todos', icon: '📚' },
    { id: 'nutrition', name: 'Nutrición', icon: '🥗' },
    { id: 'exercise', name: 'Ejercicio', icon: '💪' },
    { id: 'lifestyle', name: 'Estilo de Vida', icon: '🌟' },
    { id: 'tips', name: 'Consejos', icon: '💡' }
  ];

  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Background Overlay */}
        <div className="fixed inset-0 bg-gradient-to-r from-[#164151]/80 via-[#29839c]/70 to-[#164151]/60 backdrop-blur-sm z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 min-h-screen p-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setSelectedBlog(null)}
                className="flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                Volver a los blogs
              </button>
              <div className="text-[#85ea10] font-bold text-lg">ROGERBOX</div>
            </div>

            {/* Blog Content */}
            <article className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              {/* Blog Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-[#85ea10]/20 text-[#85ea10] rounded-full text-sm font-medium">
                    {categories.find(c => c.id === selectedBlog.category)?.name}
                  </span>
                  <div className="flex items-center text-white/60 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedBlog.readTime} min de lectura
                  </div>
                </div>
                
                <h1 className="text-4xl font-black text-white mb-4 leading-tight">
                  {selectedBlog.title}
                </h1>
                
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {selectedBlog.author}
                  </div>
                  <div className="text-sm">
                    {selectedBlog.publishedAt.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Blog Image */}
              <div className="mb-8">
                <img
                  src={selectedBlog.thumbnailUrl}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>

              {/* Blog Content */}
              <div className="prose prose-invert max-w-none">
                <p className="text-xl text-white/90 mb-6 leading-relaxed">
                  {selectedBlog.excerpt}
                </p>
                
                <div className="text-white/80 leading-relaxed space-y-4">
                  {selectedBlog.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-white/60" />
                  <span className="text-white/60 text-sm">Etiquetas:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedBlog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-r from-[#164151]/80 via-[#29839c]/70 to-[#164151]/60 backdrop-blur-sm z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-white mb-4">
              BLOG <span className="text-[#85ea10]">NUTRICIONAL</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Consejos, tips y guías gratuitas para optimizar tu alimentación y alcanzar tus objetivos
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-[#85ea10] bg-[#85ea10]/10 text-[#85ea10]'
                    : 'border-white/30 text-white hover:border-white/50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#85ea10]/50 transition-all duration-300 cursor-pointer group"
              >
                {/* Blog Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#85ea10]/20 text-[#85ea10] rounded-full text-sm font-medium">
                      {categories.find(c => c.id === blog.category)?.name}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-black/40 text-white rounded-full text-sm">
                      {blog.isFree ? 'GRATIS' : 'PREMIUM'}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#85ea10] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-white/70 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* Blog Meta */}
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {blog.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {blog.readTime} min
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="mt-4 flex items-center text-[#85ea10] group-hover:text-white transition-colors">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="font-medium">Leer más</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl text-white/60 mb-2">No hay blogs disponibles</h3>
              <p className="text-white/40">Próximamente más contenido</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

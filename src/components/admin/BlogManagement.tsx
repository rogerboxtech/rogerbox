'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, BookOpen, Clock, User, Tag } from 'lucide-react';
import { Blog } from '@/types';

interface BlogManagementProps {
  blogs: Blog[];
  onAddBlog: (blog: Omit<Blog, 'id' | 'publishedAt'>) => void;
  onEditBlog: (id: string, blog: Partial<Blog>) => void;
  onDeleteBlog: (id: string) => void;
}

export default function BlogManagement({ blogs, onAddBlog, onEditBlog, onDeleteBlog }: BlogManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [newBlog, setNewBlog] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Roger Barreto',
    category: 'nutrition' as 'nutrition' | 'exercise' | 'lifestyle' | 'tips',
    tags: [] as string[],
    readTime: 5,
    thumbnailUrl: '',
    isFree: true,
  });
  const [newTag, setNewTag] = useState('');

  const categories = [
    { id: 'nutrition', name: 'Nutrición', icon: '🥗' },
    { id: 'exercise', name: 'Ejercicio', icon: '💪' },
    { id: 'lifestyle', name: 'Estilo de Vida', icon: '🌟' },
    { id: 'tips', name: 'Consejos', icon: '💡' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlog) {
      onEditBlog(editingBlog.id, newBlog);
    } else {
      onAddBlog(newBlog);
    }
    setShowAddModal(false);
    setEditingBlog(null);
    setNewBlog({
      title: '',
      excerpt: '',
      content: '',
      author: 'Roger Barreto',
      category: 'nutrition',
      tags: [],
      readTime: 5,
      thumbnailUrl: '',
      isFree: true,
    });
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setNewBlog({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      tags: blog.tags,
      readTime: blog.readTime,
      thumbnailUrl: blog.thumbnailUrl,
      isFree: blog.isFree,
    });
    setShowAddModal(true);
  };

  const addTag = () => {
    if (newTag.trim() && !newBlog.tags.includes(newTag.trim())) {
      setNewBlog({...newBlog, tags: [...newBlog.tags, newTag.trim()]});
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewBlog({...newBlog, tags: newBlog.tags.filter(tag => tag !== tagToRemove)});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Blogs</h2>
          <p className="text-white/60">Crea y administra los artículos del blog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold px-6 py-3 rounded-xl transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Artículo</span>
        </button>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#85ea10]/50 transition-all duration-300 group">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white/80" />
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

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#85ea10] transition-colors line-clamp-2">
                {blog.title}
              </h3>
              
              <p className="text-white/70 mb-4 line-clamp-3">
                {blog.excerpt}
              </p>

              {/* Blog Meta */}
              <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {blog.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {blog.readTime} min
                  </div>
                </div>
                <span>{blog.publishedAt.toLocaleDateString('es-ES')}</span>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-white/10 text-white/80 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="px-2 py-1 bg-white/10 text-white/60 rounded-full text-xs">
                      +{blog.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-[#85ea10] font-bold text-sm">
                  {blog.isFree ? 'GRATUITO' : 'PREMIUM'}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteBlog(blog.id)}
                    className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-4xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingBlog ? 'Editar Artículo' : 'Nuevo Artículo'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Título</label>
                  <input
                    type="text"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#85ea10]"
                    placeholder="Título del artículo"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Categoría</label>
                  <select
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({...newBlog, category: e.target.value as any})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#85ea10]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-gray-800">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Autor</label>
                  <input
                    type="text"
                    value={newBlog.author}
                    onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#85ea10]"
                    placeholder="Roger Barreto"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Tiempo de Lectura (min)</label>
                  <input
                    type="number"
                    value={newBlog.readTime}
                    onChange={(e) => setNewBlog({...newBlog, readTime: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#85ea10]"
                    placeholder="5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Resumen</label>
                <textarea
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#85ea10]"
                  placeholder="Resumen del artículo"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Contenido</label>
                <textarea
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                  rows={8}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#85ea10]"
                  placeholder="Contenido completo del artículo"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">URL de Thumbnail</label>
                  <input
                    type="url"
                    value={newBlog.thumbnailUrl}
                    onChange={(e) => setNewBlog({...newBlog, thumbnailUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#85ea10]"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Tipo</label>
                  <select
                    value={newBlog.isFree ? 'free' : 'premium'}
                    onChange={(e) => setNewBlog({...newBlog, isFree: e.target.value === 'free'})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#85ea10]"
                  >
                    <option value="free" className="bg-gray-800">Gratuito</option>
                    <option value="premium" className="bg-gray-800">Premium</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Etiquetas</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {newBlog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#85ea10]/20 text-[#85ea10] rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-[#85ea10] hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#85ea10]"
                    placeholder="Agregar etiqueta"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-3 bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 text-white/80 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  {editingBlog ? 'Actualizar' : 'Crear'} Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

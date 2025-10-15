'use client';

import { useState, useEffect } from 'react';
import { NutritionalBlog } from '@/types';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, User, Clock, BookOpen } from 'lucide-react';
import DeleteBlogModal from './DeleteBlogModal';

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<NutritionalBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<NutritionalBlog | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<NutritionalBlog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    reading_time: 3,
    excerpt: '',
    content: '',
    featured_image_url: '',
    is_published: false,
  });

  // Cargar blogs
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs/admin');
      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchBlogs();
        resetForm();
        setShowForm(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error al guardar el blog');
    }
  };

  const handleEdit = (blog: NutritionalBlog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      author: blog.author,
      reading_time: blog.reading_time,
      excerpt: blog.excerpt,
      content: blog.content,
      featured_image_url: blog.featured_image_url || '',
      is_published: blog.is_published,
    });
    setShowForm(true);
  };

  const handleDeleteClick = (blog: NutritionalBlog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blogs/${blogToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchBlogs();
        setShowDeleteModal(false);
        setBlogToDelete(null);
      } else {
        alert('Error al eliminar el blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error al eliminar el blog');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      reading_time: 3,
      excerpt: '',
      content: '',
      featured_image_url: '',
      is_published: false,
    });
    setEditingBlog(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#85ea10]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Blogs Nutricionales
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-[#85ea10] text-white px-4 py-2 rounded-lg hover:bg-[#6bc20a] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Blog
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingBlog ? 'Editar Blog' : 'Crear Nuevo Blog'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#85ea10] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Autor *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#85ea10] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tiempo de lectura (minutos) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.reading_time}
                  onChange={(e) => setFormData({ ...formData, reading_time: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#85ea10] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL de imagen destacada
                </label>
                <input
                  type="url"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#85ea10] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resumen *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#85ea10] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Breve descripción del blog..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contenido *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#85ea10] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contenido completo del blog..."
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="h-4 w-4 text-[#85ea10] focus:ring-[#85ea10] border-gray-300 rounded"
              />
              <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Publicar inmediatamente
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#85ea10] text-white px-6 py-2 rounded-lg hover:bg-[#6bc20a] transition-colors"
              >
                {editingBlog ? 'Actualizar' : 'Crear'} Blog
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de blogs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
            {/* Imagen del blog */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
              {blog.featured_image_url ? (
                <img
                  src={blog.featured_image_url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/course-placeholder.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#85ea10]/20 to-[#85ea10]/40 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#85ea10]" />
                </div>
              )}
              
              {/* Estado del blog */}
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  blog.is_published
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {blog.is_published ? (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      Publicado
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 mr-1" />
                      Borrador
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Contenido del blog */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {blog.title}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {blog.excerpt}
              </p>

              {/* Meta información */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{blog.reading_time} min</span>
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(blog.created_at)}</span>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(blog)}
                  className="flex-1 bg-[#85ea10] hover:bg-[#6bc20a] text-black font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(blog)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteBlogModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        blogTitle={blogToDelete?.title || ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
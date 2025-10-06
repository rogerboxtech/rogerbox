'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Users, 
  MessageCircle,
  Send,
  Heart,
  Share2,
  ThumbsUp
} from 'lucide-react';

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  lesson_number: number;
  preview_image: string | null;
  views_count: number;
  is_preview: boolean;
  created_at: string;
}

interface Comment {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name: string;
  user_avatar: string | null;
  likes_count: number;
  is_liked: boolean;
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    console.log('LessonPage mounted, params:', resolvedParams);
    console.log('Session status:', status);
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      loadLessonData();
    }
  }, [resolvedParams.id, status, router]);

  const loadLessonData = async () => {
    try {
      console.log('Loading lesson data for ID:', resolvedParams.id);
      setLoading(true);
      setError(null);

      // Simular datos de lección por ahora
      const mockLesson: Lesson = {
        id: resolvedParams.id,
        course_id: 'mock-course-id',
        title: 'Día 1 - Full Body Express',
        description: 'Circuito completo para activar todo el cuerpo. Ejercicios de alta intensidad sin equipo.',
        video_url: '', // No hay video por ahora
        duration_minutes: 12,
        lesson_number: 1,
        preview_image: null,
        views_count: 0,
        is_preview: true,
        created_at: new Date().toISOString()
      };

      console.log('Mock lesson data:', mockLesson);
      setLesson(mockLesson);

      // Cargar comentarios simulados
      loadComments();

    } catch (error) {
      console.error('Error loading lesson data:', error);
      setError('Error al cargar la lección');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = () => {
    // Comentarios simulados
    const mockComments: Comment[] = [
      {
        id: '1',
        lesson_id: resolvedParams.id,
        user_id: 'user1',
        content: '¡Excelente lección! Muy clara y fácil de seguir.',
        created_at: new Date().toISOString(),
        user_name: 'María González',
        user_avatar: null,
        likes_count: 12,
        is_liked: false
      },
      {
        id: '2',
        lesson_id: resolvedParams.id,
        user_id: 'user2',
        content: 'Me encantó la explicación paso a paso. ¡Gracias!',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        user_name: 'Carlos Ruiz',
        user_avatar: null,
        likes_count: 8,
        is_liked: true
      },
      {
        id: '3',
        lesson_id: resolvedParams.id,
        user_id: 'user3',
        content: '¿Alguien más tuvo problemas con el ejercicio 3?',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        user_name: 'Ana Martínez',
        user_avatar: null,
        likes_count: 5,
        is_liked: false
      }
    ];
    setComments(mockComments);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !(session as any)?.user?.id) return;

    // Simular envío de comentario
    const newCommentData: Comment = {
      id: Date.now().toString(),
      lesson_id: resolvedParams.id,
      user_id: (session as any).user.id,
      content: newComment.trim(),
      created_at: new Date().toISOString(),
      user_name: (session as any).user.name || 'Usuario',
      user_avatar: (session as any).user.image || null,
      likes_count: 0,
      is_liked: false
    };

    setComments(prev => [newCommentData, ...prev]);
    setNewComment('');
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            likes_count: comment.is_liked ? comment.likes_count - 1 : comment.likes_count + 1,
            is_liked: !comment.is_liked 
          }
        : comment
    ));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)}d`;
  };

  console.log('Render state:', { loading, error, lesson: !!lesson, session: !!session });

  if (loading) {
    console.log('Showing loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando lección...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    console.log('Showing error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="bg-[#85ea10] text-black px-4 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }
  
  if (!lesson) {
    console.log('No lesson found');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-500 text-xl mb-4">Lección no encontrada</p>
          <button 
            onClick={() => router.back()}
            className="bg-[#85ea10] text-black px-4 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Botón de regreso flotante */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-20 flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Volver</span>
      </button>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video principal */}
          <div className="lg:col-span-3 space-y-4">
            {/* Video player */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative group">
                {lesson.video_url ? (
                  <div className="relative w-full h-full">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      poster={lesson.preview_image || undefined}
                    >
                      <source src={lesson.video_url} type="video/mp4" />
                      Tu navegador no soporta el elemento video.
                    </video>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-12 h-12 text-gray-500" />
                    </div>
                    <p className="text-gray-400">Video no disponible</p>
                    <p className="text-gray-500 text-sm mt-2">Esta lección aún no tiene video</p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de la lección */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {lesson.lesson_number}. {lesson.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {lesson.description}
                  </p>
                  
                  {/* Estadísticas de la lección */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{lesson.views_count} visualizaciones</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{comments.length} comentarios</span>
                    </div>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorited 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => {/* Lógica para compartir */}}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comentarios */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Comentarios ({comments.length})
              </h3>

              {/* Formulario de comentario */}
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe tu comentario..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-sm"
                      rows={2}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      newComment.trim()
                        ? 'bg-[#85ea10] hover:bg-[#7dd30f] text-black'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Lista de comentarios */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-[#85ea10] rounded-full flex items-center justify-center text-black font-semibold text-xs">
                        {comment.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white text-xs">
                            {comment.user_name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-xs mb-1">
                          {comment.content}
                        </p>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className={`flex items-center space-x-1 text-xs transition-colors ${
                              comment.is_liked
                                ? 'text-[#85ea10]'
                                : 'text-gray-500 dark:text-gray-400 hover:text-[#85ea10]'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{comment.likes_count}</span>
                          </button>
                          <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            Responder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
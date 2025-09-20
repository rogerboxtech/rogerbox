'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Weight, Ruler, Target, Trophy, Calendar, Edit, ArrowLeft, X, Eye, EyeOff } from 'lucide-react';
import SimpleLoading from '@/components/SimpleLoading';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  height: number;
  weight: number;
  gender: string;
  goals: string[];
  target_weight: number | null;
  membership_status: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Obtener datos del perfil desde Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.email) {
        try {
          console.log('Buscando perfil para email:', session.user.email);
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();

          if (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
            return;
          }

          if (data) {
            console.log('Perfil encontrado:', data);
            console.log('Nombre actual en Supabase:', data.name);
            console.log('Email actual en Supabase:', data.email);
            setUserProfile(data);
          } else {
            console.log('No se encontró perfil para este email, creando uno nuevo en Supabase');
            // Crear perfil en Supabase si no existe
            const newProfile = {
              id: session.user.id || '',
              name: session.user.name || 'Usuario',
              email: session.user.email || '',
              height: 170,
              weight: 70,
              gender: 'other' as const,
              goals: [],
              target_weight: null,
              membership_status: 'inactive' as const
            };

            try {
              // Insertar en Supabase
              const { data: insertData, error: insertError } = await supabase
                .from('profiles')
                .insert([newProfile])
                .select();

              if (insertError) {
                console.error('Error creando perfil:', insertError);
                // Si es error de duplicado, buscar el perfil existente
                if (insertError.code === '23505') {
                  console.log('Perfil ya existe, buscando...');
                  const { data: existingData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                  
                  if (existingData) {
                    console.log('Perfil existente encontrado:', existingData);
                    setUserProfile(existingData);
                  } else {
                    setUserProfile(newProfile);
                  }
                } else {
                  console.error('Error no manejado:', insertError);
                  setUserProfile(newProfile);
                }
              } else {
                console.log('Perfil creado en Supabase:', insertData);
                setUserProfile(insertData[0]);
              }
            } catch (error) {
              console.error('Error inesperado al crear perfil:', error);
              setUserProfile(newProfile);
            }
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserProfile();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status, router]);

  // Función para abrir el modal de edición
  const handleEditProfile = () => {
    if (userProfile) {
      setEditForm({
        name: userProfile.name,
        email: userProfile.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowEditModal(true);
      setEditError('');
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditError('');
  };

  // Función para actualizar el perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');

    try {
      // Validar contraseñas si se está cambiando
      if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
        setEditError('Las contraseñas nuevas no coinciden');
        setEditLoading(false);
        return;
      }

      if (editForm.newPassword && editForm.newPassword.length < 6) {
        setEditError('La nueva contraseña debe tener al menos 6 caracteres');
        setEditLoading(false);
        return;
      }

      // Actualizar datos en Supabase
      console.log('=== INICIANDO ACTUALIZACIÓN ===');
      console.log('ID del perfil:', userProfile?.id);
      console.log('Email actual:', userProfile?.email);
      console.log('Nuevos datos:', { name: editForm.name, email: editForm.email });
      
      // Primero verificar que el perfil existe
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userProfile?.id);

      console.log('Perfil existente:', existingProfile);
      console.log('Error al buscar:', fetchError);

      if (fetchError) {
        setEditError(`Error al buscar perfil: ${fetchError.message}`);
        setEditLoading(false);
        return;
      }

      if (!existingProfile || existingProfile.length === 0) {
        setEditError('No se encontró el perfil para actualizar');
        setEditLoading(false);
        return;
      }

      // Ahora actualizar
      const { data: updateData, error: profileError } = await supabase
        .from('profiles')
        .update({
          name: editForm.name,
          email: editForm.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile?.id)
        .select();

      console.log('Resultado de actualización:', { updateData, profileError });

      if (profileError) {
        console.error('Error detallado:', profileError);
        setEditError(`Error al actualizar perfil: ${profileError.message}`);
        setEditLoading(false);
        return;
      }

      console.log('Perfil actualizado exitosamente:', updateData);
      console.log('=== ACTUALIZACIÓN COMPLETADA ===');

      // Si se está cambiando la contraseña, actualizar en Auth
      if (editForm.newPassword) {
        const { error: authError } = await supabase.auth.updateUser({
          password: editForm.newPassword
        });

        if (authError) {
          setEditError(`Error al actualizar contraseña: ${authError.message}`);
          setEditLoading(false);
          return;
        }
      }

      // Actualizar el estado local inmediatamente
      setUserProfile(prev => prev ? {
        ...prev,
        name: editForm.name,
        email: editForm.email
      } : null);

      console.log('Estado local actualizado con:', { name: editForm.name, email: editForm.email });

      // Cerrar modal
      setShowEditModal(false);
      
      // Esperar un momento y luego recargar
      setTimeout(() => {
        const timestamp = new Date().getTime();
        window.location.href = `/dashboard?t=${timestamp}`;
      }, 1000);
      
    } catch (error) {
      setEditError(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setEditLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <SimpleLoading message="Cargando perfil..." size="lg" />;
  }

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (!session?.user || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#164151]/80 via-[#29839c]/70 to-[#29839c]/60">
      {/* Header */}
      <header className="bg-transparent border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-white">
                ROGER<span className="text-[#85ea10]">BOX</span>
              </h1>
            </div>
            
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <div className="w-24 h-24 bg-[#85ea10] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{userProfile.name}</h2>
                <p className="text-white/60 mb-6">{userProfile.email}</p>
                
                <button 
                  onClick={handleEditProfile}
                  className="w-full bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Editar Perfil</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <User className="w-6 h-6" />
                  <span>Información Personal</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-[#85ea10]" />
                      <div>
                        <p className="text-white/60 text-sm">Email</p>
                        <p className="text-white font-medium">{userProfile.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Weight className="w-5 h-5 text-[#85ea10]" />
                      <div>
                        <p className="text-white/60 text-sm">Peso</p>
                        <p className="text-white font-medium">{userProfile.weight || 0} kg</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Ruler className="w-5 h-5 text-[#85ea10]" />
                      <div>
                        <p className="text-white/60 text-sm">Altura</p>
                        <p className="text-white font-medium">{userProfile.height || 0} cm</p>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* Goals */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Trophy className="w-6 h-6" />
                  <span>Mis Objetivos</span>
                </h3>
                
                <div className="flex flex-wrap gap-3">
                  {userProfile.goals && userProfile.goals.length > 0 ? (
                    userProfile.goals.map((goal, index) => {
                      const goalLabels: { [key: string]: string } = {
                        'lose_weight': 'Bajar de Peso',
                        'tone': 'Tonificar',
                        'gain_muscle': 'Ganar Músculo',
                        'flexibility': 'Flexibilidad',
                        'strength': 'Fuerza',
                        'endurance': 'Resistencia'
                      };
                      
                      const displayText = goalLabels[goal] || goal.replace('_', ' ');
                      
                      return (
                        <span
                          key={index}
                          className="bg-[#85ea10]/20 text-[#85ea10] px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {displayText}
                        </span>
                      );
                    })
                  ) : (
                    <p className="text-white/60">No hay objetivos definidos</p>
                  )}
                </div>
              </div>

              {/* Membership Status */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Calendar className="w-6 h-6" />
                  <span>Estado de Membresía</span>
                </h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Estado Actual</p>
                    <p className="text-white font-medium capitalize">
                      {userProfile.membership_status === 'active' ? 'Activa' : 'Inactiva'}
                    </p>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    userProfile.membership_status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {userProfile.membership_status === 'active' ? 'Activa' : 'Inactiva'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#164151]/90 via-[#29839c]/80 to-[#29839c]/70 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Editar Perfil</h3>
              <button
                onClick={handleCloseModal}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-transparent placeholder-white/60 text-white"
                  placeholder="Ingresa tu nombre completo"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-transparent placeholder-white/60 text-white"
                  placeholder="tu.email@ejemplo.com"
                  required
                />
              </div>

              {/* Nueva Contraseña */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Nueva Contraseña (opcional)
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-transparent placeholder-white/60 text-white"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              {editForm.newPassword && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={editForm.confirmPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-transparent placeholder-white/60 text-white"
                      placeholder="Repite la nueva contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {editError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300 text-sm">{editError}</p>
                </div>
              )}

              {/* Botones */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 bg-[#85ea10] hover:bg-[#7dd30f] disabled:bg-gray-500 text-black font-bold px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {editLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

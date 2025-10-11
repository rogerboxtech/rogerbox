'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, User, Target, Weight, Ruler, Calendar, Utensils } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  isUpdating?: boolean;
  userName?: string;
}

interface UserProfile {
  name: string;
  height: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  birthYear?: number;
  goals: string[];
  targetWeight?: number;
  dietaryHabits?: string[];
}

export default function Onboarding({ onComplete, isUpdating = false, userName = 'Usuario' }: OnboardingProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    name: userName,
    height: 170,
    gender: 'male',
    weight: 70,
    birthYear: 1995,
    goals: [],
    dietaryHabits: []
  });

  // Calculate target weight based on BMI
  const calculateTargetWeight = (height: number, weight: number, goals: string[]) => {
    const currentBMI = weight / Math.pow(height / 100, 2);
    
    if (goals.includes('bajar de peso') || goals.includes('perder peso')) {
      // Target BMI between 20-22 for weight loss
      const targetBMI = 21;
      return Math.round(targetBMI * Math.pow(height / 100, 2));
    } else if (goals.includes('ganar masa muscular') || goals.includes('musculación')) {
      // Target BMI between 22-24 for muscle gain
      const targetBMI = 23;
      return Math.round(targetBMI * Math.pow(height / 100, 2));
    } else {
      // Maintain current weight if no specific goal
      return weight;
    }
  };

  const steps = [
    {
      title: "¿Cuál es tu altura?",
      icon: <Ruler className="w-8 h-8 text-[#85ea10]" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-black text-gray-900 dark:text-white mb-4">
              {profile.height} cm
            </div>
            <input
              type="range"
              min="140"
              max="220"
              value={profile.height}
              onChange={(e) => setProfile({...profile, height: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="flex justify-between text-gray-600 dark:text-white/60 text-sm">
            <span>140 cm</span>
            <span>220 cm</span>
          </div>
        </div>
      )
    },
    {
      title: "¿Cuál es tu sexo?",
      icon: <User className="w-8 h-8 text-[#85ea10]" />,
      component: (
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'male', label: 'Hombre', emoji: '👨' },
            { value: 'female', label: 'Mujer', emoji: '👩' },
            { value: 'other', label: 'Otro', emoji: '🧑' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setProfile({...profile, gender: option.value as any})}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                profile.gender === option.value
                  ? 'border-[#85ea10] bg-[#85ea10]/10 text-[#85ea10]'
                  : 'border-gray-200 dark:border-white/30 text-gray-900 dark:text-white hover:border-[#85ea10]/50'
              }`}
            >
              <div className="text-4xl mb-2">{option.emoji}</div>
              <div className="font-bold">{option.label}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "¿Cuál es tu peso actual?",
      icon: <Weight className="w-8 h-8 text-[#85ea10]" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-black text-gray-900 dark:text-white mb-4">
              {profile.weight} kg
            </div>
            <input
              type="range"
              min="40"
              max="150"
              value={profile.weight}
              onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="flex justify-between text-gray-600 dark:text-white/60 text-sm">
            <span>40 kg</span>
            <span>150 kg</span>
          </div>
          {profile.goals.length > 0 && (
            <div className="mt-6 p-4 bg-[#85ea10]/10 border border-[#85ea10]/30 rounded-xl">
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-white/80 mb-2">Tu meta de peso recomendada:</div>
                <div className="text-2xl font-bold text-[#85ea10]">
                  {calculateTargetWeight(profile.height, profile.weight, profile.goals)} kg
                </div>
                <div className="text-xs text-gray-500 dark:text-white/60 mt-1">
                  Basado en tu altura y objetivos
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "¿En qué año naciste?",
      icon: <Calendar className="w-8 h-8 text-[#85ea10]" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-black text-gray-900 dark:text-white mb-4">
              {profile.birthYear}
            </div>
            <input
              type="range"
              min="1950"
              max="2010"
              value={profile.birthYear}
              onChange={(e) => setProfile({...profile, birthYear: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="flex justify-between text-gray-600 dark:text-white/60 text-sm">
            <span>1950</span>
            <span>2010</span>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-white/60">
            Edad: {profile.birthYear ? new Date().getFullYear() - profile.birthYear : 'No especificada'} años
          </div>
        </div>
      )
    },
    {
      title: "¿Qué quieres lograr?",
      icon: <Target className="w-8 h-8 text-[#85ea10]" />,
      component: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'lose_weight', label: 'Bajar de peso', emoji: '🔥' },
            { id: 'tone', label: 'Tonificar', emoji: '💪' },
            { id: 'gain_muscle', label: 'Ganar músculo', emoji: '🏋️' },
            { id: 'endurance', label: 'Resistencia', emoji: '🏃' },
            { id: 'flexibility', label: 'Flexibilidad', emoji: '🧘' },
            { id: 'strength', label: 'Fuerza', emoji: '⚡' }
          ].map((goal) => (
            <button
              key={goal.id}
              onClick={() => {
                const newGoals = profile.goals.includes(goal.id)
                  ? profile.goals.filter(g => g !== goal.id)
                  : [...profile.goals, goal.id];
                setProfile({...profile, goals: newGoals});
              }}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                profile.goals.includes(goal.id)
                  ? 'border-[#85ea10] bg-[#85ea10]/10 text-[#85ea10]'
                  : 'border-gray-200 dark:border-white/30 text-gray-900 dark:text-white hover:border-[#85ea10]/50'
              }`}
            >
              <div className="text-2xl mb-2">{goal.emoji}</div>
              <div className="font-bold text-sm">{goal.label}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "¿Cuáles son tus hábitos alimenticios?",
      icon: <Utensils className="w-8 h-8 text-[#85ea10]" />,
      component: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'none', label: 'Sin hábitos específicos', emoji: '🍽️' },
            { id: 'vegetarian', label: 'Vegetariano', emoji: '🥗' },
            { id: 'vegan', label: 'Vegano', emoji: '🌱' },
            { id: 'keto', label: 'Keto', emoji: '🥑' },
            { id: 'paleo', label: 'Paleo', emoji: '🥩' },
            { id: 'mediterranean', label: 'Mediterráneo', emoji: '🐟' },
            { id: 'flexible', label: 'Flexible', emoji: '🍽️' },
            { id: 'gluten_free', label: 'Sin Gluten', emoji: '🌾' },
            { id: 'dairy_free', label: 'Sin Lácteos', emoji: '🥛' }
          ].map((habit) => (
            <button
              key={habit.id}
              onClick={() => {
                const newHabits = (profile.dietaryHabits || []).includes(habit.id)
                  ? (profile.dietaryHabits || []).filter(h => h !== habit.id)
                  : [...(profile.dietaryHabits || []), habit.id];
                setProfile({...profile, dietaryHabits: newHabits});
              }}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                (profile.dietaryHabits || []).includes(habit.id)
                  ? 'border-[#85ea10] bg-[#85ea10]/10 text-[#85ea10]'
                  : 'border-gray-200 dark:border-white/30 text-gray-900 dark:text-white hover:border-[#85ea10]/50'
              }`}
            >
              <div className="text-2xl mb-2">{habit.emoji}</div>
              <div className="font-bold text-sm">{habit.label}</div>
            </button>
          ))}
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate target weight before completing
      const targetWeight = calculateTargetWeight(profile.height, profile.weight, profile.goals);
      onComplete({ ...profile, targetWeight, name: userName });
    }
  };

  const handleSkip = () => {
    onComplete({ ...profile, name: userName });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
              ROGER<span className="text-[#85ea10]">BOX</span>
            </h1>
            <p className="text-gray-600 dark:text-white/80">Personaliza tu experiencia</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-gray-600 dark:text-white/60 text-sm mb-2">
              <span>Paso {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-white/20 rounded-full h-2">
              <div 
                className="bg-[#85ea10] h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-white/20 shadow-xl">
            <div className="text-center mb-8">
              {steps[currentStep].icon}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                {steps[currentStep].title}
              </h2>
            </div>

            {steps[currentStep].component}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleSkip}
                className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Saltar
              </button>
              
              <button
                onClick={handleNext}
                disabled={(currentStep === 4 && profile.goals.length === 0) || isUpdating}
                className="bg-[#85ea10] hover:bg-[#7dd30f] disabled:bg-[#85ea10]/70 disabled:cursor-not-allowed text-black font-bold px-8 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

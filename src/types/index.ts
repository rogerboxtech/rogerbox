export interface User {
  id: string;
  name: string;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female';
  goals: string[];
  targetWeight?: number; // calculated target weight
  membership?: Membership;
  reservations: Reservation[];
  attendances: Attendance[];
  videoPurchases: VideoPurchase[];
  digitalRoutinePurchases: DigitalRoutinePurchase[];
  nutritionalPlanPurchases: NutritionalPlanPurchase[];
  createdAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  isActive: boolean;
  startDate: Date;
  price: number; // COP 135,000
  endDate?: Date; // for future expansion
}

export interface Class {
  id: string;
  name: string;
  time: string; // HH:MM format
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  duration: number; // in minutes
  intensity: 'Low' | 'Medium' | 'High';
  capacity: number;
  instructor: string;
  description?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  classId: string;
  classDate: Date;
  createdAt: Date;
  status: 'active' | 'cancelled';
}

export interface Attendance {
  id: string;
  userId: string;
  classId: string;
  classDate: Date;
  caloriesBurned: number;
  confirmedAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string; // embedded URL
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  price: number; // in COP
  purchaseCount: number;
  createdAt: Date;
}

export interface VideoPurchase {
  id: string;
  userId: string;
  videoId: string;
  purchasedAt: Date;
  price: number;
}

export interface DigitalRoutinePurchase {
  id: string;
  userId: string;
  purchasedAt: Date;
  price: number;
}

export interface AdminStats {
  totalUsers: number;
  activeMemberships: number;
  weeklyReservations: number;
  weeklyAttendances: number;
}

export interface ClassAttendance {
  classId: string;
  className: string;
  classTime: string;
  classDate: Date;
  totalCapacity: number;
  attendedCount: number;
  attendees: string[]; // user names
}

export type UserRole = 'student' | 'admin';

export interface NutritionalPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // in days
  price: number; // in COP
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'detox';
  videoUrl: string; // instructional video
  thumbnailUrl: string;
  menu: DailyMenu[];
  nutritionalInfo: NutritionalInfo;
  purchaseCount: number;
  createdAt: Date;
}

export interface DailyMenu {
  day: number;
  meals: Meal[];
  totalCalories: number;
  macros: {
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
  };
}

export interface Meal {
  name: string;
  time: string; // "08:00", "13:00", etc.
  foods: FoodItem[];
  calories: number;
}

export interface FoodItem {
  name: string;
  quantity: string; // "1 taza", "200g", etc.
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionalInfo {
  totalCalories: number;
  protein: number; // grams per day
  carbs: number; // grams per day
  fat: number; // grams per day
  fiber: number; // grams per day
  sugar: number; // grams per day
  sodium: number; // mg per day
}

export interface NutritionalPlanPurchase {
  id: string;
  userId: string;
  planId: string;
  purchasedAt: Date;
  price: number;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: 'nutrition' | 'exercise' | 'lifestyle' | 'tips';
  tags: string[];
  readTime: number; // in minutes
  thumbnailUrl: string;
  publishedAt: Date;
  isFree: boolean;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  classes: Class[];
  videos: Video[];
  nutritionalPlans: NutritionalPlan[];
  blogs: Blog[];
  isAdminMode: boolean;
}

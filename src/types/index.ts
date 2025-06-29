export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin' | 'super-admin';
  studentId?: string;
  selectedMessId?: string;
  adminKey?: string; // Key provided by super admin for admin login
  messName?: string; // Name of the mess (populated for admins)
}

export interface Mess {
  id: string;
  name: string;
  adminKey: string; // Key for admin access
  facilities: string[];
  isActive: boolean;
  createdAt: string;
  description?: string;
}

export interface AdminKey {
  id: string;
  key: string;
  messId: string;
  messName: string;
  createdAt: string;
  isActive: boolean;
}

export interface Bill {
  id: string;
  studentId: string;
  studentName: string;
  messId: string;
  messName: string;
  month: string;
  totalAmount: number;
  status: 'pending' | 'paid';
  generatedAt: string;
  downloadCount: number;
  items: BillItem[];
}

export interface BillItem {
  date: string;
  mealName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  available: boolean;
  image?: string;
  likes?: number;
  dislikes?: number;
  messId?: string;
}

export interface MealRecord {
  id: string;
  userId: string;
  menuItemId: string;
  menuItemName: string;
  price: number;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  userRating?: 'like' | 'dislike' | null;
  messId?: string;
  messName?: string;
}

export interface DailyConsumption {
  date: string;
  totalAmount: number;
  meals: MealRecord[];
}

export interface MonthlyBill {
  month: string;
  totalAmount: number;
  days: DailyConsumption[];
  messId?: string;
  messName?: string;
}

export * from './messaging';

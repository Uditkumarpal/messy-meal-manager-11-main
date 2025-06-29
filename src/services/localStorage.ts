
import { User, MenuItem, MealRecord } from "@/types";

export const USERS_KEY = "mess_users";
export const MENU_ITEMS_KEY = "mess_menu_items";
export const MEAL_RECORDS_KEY = "mess_meal_records";

// Mock initial data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "student",
    studentId: "ST001",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "3",
    name: "Super Admin",
    email: "superadmin@example.com",
    password: "super123",
    role: "super-admin",
  },
];

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Breakfast Combo",
    description: "Toast, eggs, and coffee",
    price: 50,
    category: "breakfast",
    available: true,
    likes: 15,
    dislikes: 2,
  },
  {
    id: "2",
    name: "Lunch Special",
    description: "Rice, dal, vegetables, and roti",
    price: 80,
    category: "lunch",
    available: true,
    likes: 25,
    dislikes: 1,
  },
  {
    id: "3",
    name: "Dinner Thali",
    description: "Complete dinner with variety",
    price: 90,
    category: "dinner",
    available: true,
    likes: 30,
    dislikes: 3,
  },
];

const mockMealRecords: MealRecord[] = [
  {
    id: "1",
    userId: "1",
    menuItemId: "1",
    menuItemName: "Breakfast Combo",
    price: 50,
    date: new Date().toISOString().split('T')[0],
    mealType: "breakfast",
    userRating: "like",
  },
  {
    id: "2",
    userId: "1",
    menuItemId: "2",
    menuItemName: "Lunch Special",
    price: 80,
    date: new Date().toISOString().split('T')[0],
    mealType: "lunch",
    userRating: "like",
  },
];

export const initializeData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(MENU_ITEMS_KEY)) {
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(mockMenuItems));
  }
  if (!localStorage.getItem(MEAL_RECORDS_KEY)) {
    localStorage.setItem(MEAL_RECORDS_KEY, JSON.stringify(mockMealRecords));
  }
};

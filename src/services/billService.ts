
import { Bill, BillItem, MealRecord, User } from "@/types";
import { getUsers } from "./userService";
import { getMealRecords } from "./mealService";

const BILLS_KEY = "mess_bills";

// Initialize bills data
export const initializeBillsData = () => {
  if (!localStorage.getItem(BILLS_KEY)) {
    localStorage.setItem(BILLS_KEY, JSON.stringify([]));
  }
};

// Get all bills
export const getAllBills = (): Bill[] => {
  initializeBillsData();
  return JSON.parse(localStorage.getItem(BILLS_KEY) || "[]");
};

// Get bills by mess ID
export const getMessBills = (messId: string): Bill[] => {
  const bills = getAllBills();
  return bills.filter(bill => bill.messId === messId);
};

// Get user's bills
export const getUserBills = (userId: string): Bill[] => {
  const bills = getAllBills();
  return bills.filter(bill => bill.studentId === userId);
};

// Generate bills for a specific month
export const generateBillsForMonth = (month: string): void => {
  const users = getUsers();
  const students = users.filter(user => user.role === 'student');
  const mealRecords = getMealRecords();
  const bills = getAllBills();
  
  students.forEach(student => {
    // Check if bill already exists for this student and month
    const existingBill = bills.find(bill => 
      bill.studentId === student.id && bill.month === month
    );
    
    if (!existingBill) {
      // Get meal records for this student in the specified month
      const studentMeals = mealRecords.filter(meal => 
        meal.userId === student.id && 
        meal.date.startsWith(month)
      );
      
      if (studentMeals.length > 0) {
        const billItems: BillItem[] = studentMeals.map(meal => ({
          date: meal.date,
          mealName: meal.menuItemName,
          mealType: meal.mealType,
          price: meal.price
        }));
        
        const totalAmount = studentMeals.reduce((sum, meal) => sum + meal.price, 0);
        
        const newBill: Bill = {
          id: Date.now().toString() + student.id,
          studentId: student.id,
          studentName: student.name,
          messId: student.selectedMessId || "default",
          messName: "Default Mess",
          month,
          totalAmount,
          status: 'pending',
          generatedAt: new Date().toISOString(),
          downloadCount: 0,
          items: billItems
        };
        
        bills.push(newBill);
      }
    }
  });
  
  localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
};

// Send bill notifications
export const sendBillNotifications = (billIds: string[]): void => {
  // In a real app, this would send notifications
  // For now, we'll just log the action
  console.log(`Sent notifications for ${billIds.length} bills`);
};

// Update bill status
export const updateBillStatus = (billId: string, status: 'pending' | 'paid'): void => {
  const bills = getAllBills();
  const billIndex = bills.findIndex(bill => bill.id === billId);
  
  if (billIndex >= 0) {
    bills[billIndex].status = status;
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  }
};

// Get daily consumption for admin dashboard
export const getDailyConsumption = (date: string): { totalAmount: number; mealCount: number; studentCount: number } => {
  const mealRecords = getMealRecords();
  const dailyMeals = mealRecords.filter(meal => meal.date === date);
  
  const totalAmount = dailyMeals.reduce((sum, meal) => sum + meal.price, 0);
  const studentCount = new Set(dailyMeals.map(meal => meal.userId)).size;
  
  return {
    totalAmount,
    mealCount: dailyMeals.length,
    studentCount
  };
};

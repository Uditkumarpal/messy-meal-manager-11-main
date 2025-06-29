import { MealRecord, DailyConsumption, MonthlyBill } from "@/types";
import { MEAL_RECORDS_KEY, initializeData } from "./localStorage";
import { getMenuItem } from "./menuService";
import { getMessById } from "./messService";

// Meal record related functions
export const getMealRecords = (): MealRecord[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(MEAL_RECORDS_KEY) || "[]");
};

export const getUserMealRecords = (userId: string): MealRecord[] => {
  const records = getMealRecords();
  return records.filter((record) => record.userId === userId);
};

export const getUserDailyConsumption = (userId: string): DailyConsumption[] => {
  const records = getUserMealRecords(userId);
  
  // Group by date
  const groupedByDate: Record<string, MealRecord[]> = {};
  records.forEach(record => {
    if (!groupedByDate[record.date]) {
      groupedByDate[record.date] = [];
    }
    groupedByDate[record.date].push(record);
  });
  
  // Calculate totals and format
  return Object.entries(groupedByDate).map(([date, meals]) => {
    const totalAmount = meals.reduce((sum, meal) => sum + meal.price, 0);
    return {
      date,
      totalAmount,
      meals,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getTodaysMeals = (userId: string): MealRecord[] => {
  const today = new Date().toISOString().split('T')[0];
  const records = getUserMealRecords(userId);
  return records.filter((record) => record.date === today);
};

export const addMealRecord = (record: Omit<MealRecord, "id">): void => {
  const records = getMealRecords();
  const newRecord = {
    ...record,
    id: Date.now().toString(),
  };
  
  records.push(newRecord);
  localStorage.setItem(MEAL_RECORDS_KEY, JSON.stringify(records));
};

// For the admin to record a student's meal
export const recordStudentMeal = (userId: string, menuItemId: string): void => {
  const menuItem = getMenuItem(menuItemId);
  if (menuItem && menuItem.available) {
    const today = new Date().toISOString().split('T')[0];
    const mess = menuItem.messId ? getMessById(menuItem.messId) : null;
    
    addMealRecord({
      userId,
      menuItemId,
      menuItemName: menuItem.name,
      price: menuItem.price,
      date: today,
      mealType: menuItem.category,
      messId: menuItem.messId,
      messName: mess?.name,
    });
  }
};

// Get monthly bills for a user
export const getUserMonthlyBills = (userId: string): MonthlyBill[] => {
  const dailyConsumption = getUserDailyConsumption(userId);
  
  // Group by month (YYYY-MM)
  const groupedByMonth: Record<string, DailyConsumption[]> = {};
  
  dailyConsumption.forEach(daily => {
    const month = daily.date.substring(0, 7); // Get YYYY-MM from YYYY-MM-DD
    if (!groupedByMonth[month]) {
      groupedByMonth[month] = [];
    }
    groupedByMonth[month].push(daily);
  });
  
  // Calculate monthly totals
  return Object.entries(groupedByMonth).map(([month, days]) => {
    const totalAmount = days.reduce((sum, day) => sum + day.totalAmount, 0);
    return {
      month,
      totalAmount,
      days,
    };
  }).sort((a, b) => b.month.localeCompare(a.month)); // Sort newest first
};

// Download bill functionality
export const downloadBill = (userId: string, month: string): void => {
  const monthlyBills = getUserMonthlyBills(userId);
  const bill = monthlyBills.find(b => b.month === month);
  
  if (!bill) {
    throw new Error("Bill not found");
  }

  // Create bill content
  const billContent = generateBillContent(bill);
  
  // Create and download file
  const blob = new Blob([billContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `mess-bill-${month}.txt`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const generateBillContent = (bill: MonthlyBill): string => {
  const formatMonth = (month: string) => {
    try {
      const date = new Date(month + "-01");
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch (e) {
      return month;
    }
  };

  let content = `MESS BILL - ${formatMonth(bill.month)}\n`;
  content += `================================\n\n`;
  
  if (bill.messName) {
    content += `Mess: ${bill.messName}\n`;
  }
  
  content += `Total Amount: ₹${bill.totalAmount}\n\n`;
  content += `DAILY BREAKDOWN:\n`;
  content += `================\n`;

  bill.days.forEach(day => {
    content += `\nDate: ${new Date(day.date).toDateString()}\n`;
    content += `Daily Total: ₹${day.totalAmount}\n`;
    content += `Meals:\n`;
    
    day.meals.forEach(meal => {
      content += `  - ${meal.menuItemName} (${meal.mealType}) - ₹${meal.price}\n`;
    });
  });

  content += `\n================================\n`;
  content += `Generated on: ${new Date().toLocaleDateString()}\n`;

  return content;
};

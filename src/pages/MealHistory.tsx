
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserDailyConsumption, getMessById } from "@/services";
import { CalendarIcon, Utensils } from "lucide-react";

const MealHistory = () => {
  const { user } = useAuth();

  if (!user) return null;

  const consumptionHistory = getUserDailyConsumption(user.id);
  const userMess = user.selectedMessId ? getMessById(user.selectedMessId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daily Meal History</h1>
        {userMess && (
          <div className="bg-mess-light px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Your Mess</p>
            <p className="font-semibold text-mess-primary">{userMess.name}</p>
          </div>
        )}
      </div>
      
      {consumptionHistory.length > 0 ? (
        consumptionHistory.map((dailyRecord) => (
          <Card key={dailyRecord.date} className="overflow-hidden">
            <CardHeader className="bg-mess-light">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-mess-primary" />
                  <CardTitle>{new Date(dailyRecord.date).toDateString()}</CardTitle>
                </div>
                <CardDescription className="text-base font-semibold">
                  Total: ₹{dailyRecord.totalAmount}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {dailyRecord.meals.map((meal) => (
                  <div key={meal.id} className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2 text-mess-secondary" />
                      <div>
                        <p className="font-medium">{meal.menuItemName}</p>
                        <p className="text-sm text-gray-500 capitalize">{meal.mealType}</p>
                        {meal.messName && (
                          <p className="text-xs text-gray-400">{meal.messName}</p>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold">₹{meal.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="text-center py-6">
            <Utensils className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No meal history found</p>
            <p className="text-sm text-gray-400 mt-2">Start ordering meals to see your daily consumption</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MealHistory;

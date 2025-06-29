
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserMonthlyBills, getMessById, downloadBill } from "@/services";
import { Receipt, Calendar, ChevronDown, ChevronUp, Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const MonthlyBill = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  if (!user) return null;

  const monthlyBills = getUserMonthlyBills(user.id);
  const userMess = user.selectedMessId ? getMessById(user.selectedMessId) : null;

  const handleToggleMonth = (month: string) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  const handleDownloadBill = (month: string) => {
    try {
      downloadBill(user.id, month);
      toast({
        title: "Bill Downloaded",
        description: `Monthly bill for ${formatMonth(month)} has been downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the bill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatMonth = (month: string) => {
    try {
      const date = new Date(month + "-01");
      return format(date, "MMMM yyyy");
    } catch (e) {
      return month;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Monthly Bills</h1>
        {userMess && (
          <div className="bg-mess-light px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Your Mess</p>
            <p className="font-semibold text-mess-primary">{userMess.name}</p>
          </div>
        )}
      </div>
      
      {monthlyBills.length > 0 ? (
        monthlyBills.map((bill) => (
          <Card key={bill.month} className="overflow-hidden">
            <CardHeader 
              className="bg-mess-light cursor-pointer"
              onClick={() => handleToggleMonth(bill.month)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Receipt className="mr-2 h-5 w-5 text-mess-primary" />
                  <CardTitle>{formatMonth(bill.month)}</CardTitle>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadBill(bill.month);
                    }}
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <CardDescription className="text-base font-semibold">
                    Total: ₹{bill.totalAmount}
                  </CardDescription>
                  {expandedMonth === bill.month ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>
            </CardHeader>
            
            {expandedMonth === bill.month && (
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {bill.days.map((day) => (
                    <div key={day.date} className="border-b pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-mess-secondary" />
                          <span className="font-medium">{new Date(day.date).toDateString()}</span>
                        </div>
                        <span className="font-semibold">₹{day.totalAmount}</span>
                      </div>
                      
                      <div className="pl-6 space-y-2">
                        {day.meals.map((meal) => (
                          <div key={meal.id} className="flex justify-between items-center text-sm">
                            <div>
                              <span>{meal.menuItemName}</span>
                              <span className="text-gray-500 ml-2 capitalize">({meal.mealType})</span>
                              {meal.messName && (
                                <span className="text-gray-400 ml-2">- {meal.messName}</span>
                              )}
                            </div>
                            <span>₹{meal.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="text-center py-6">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No billing history found</p>
            <p className="text-sm text-gray-400 mt-2">Your monthly bills will appear here once you start consuming meals</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MonthlyBill;

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, TrendingUp, Users, DollarSign, Utensils, Receipt, Send, Download, Bell, RefreshCw, UserMinus, AlertTriangle } from "lucide-react";
import { getMealRecords, getUsers, getAllBills, generateBillsForMonth, updateUser } from "@/services";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, isAdmin, isStudent, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please log in to access the dashboard.</p>
      </div>
    );
  }

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7);
  const mealRecords = getMealRecords();
  const allUsers = getUsers();
  const allBills = getAllBills();
  
  // Filter today's meals
  const todaysMeals = mealRecords.filter(meal => meal.date === today);
  
  // For admin: filter students by the same mess as admin
  const messStudents = allUsers.filter(u => 
    u.role === 'student' && 
    u.selectedMessId === user.selectedMessId
  );
  
  const todaysStudentMeals = todaysMeals.filter(meal => {
    const mealUser = messStudents.find(u => u.id === meal.userId);
    return mealUser && meal.messId === user.selectedMessId;
  });

  const todaysRevenue = todaysStudentMeals.reduce((sum, meal) => sum + meal.price, 0);
  const uniqueStudentsToday = new Set(todaysStudentMeals.map(meal => meal.userId)).size;
  
  // Filter bills to show only students from the admin's mess - CORRECTED
  const currentMonthBills = allBills.filter(bill => {
    // Find if the student in this bill is actually registered to this mess
    const student = messStudents.find(s => s.id === bill.studentId);
    return bill.month === currentMonth && student && bill.messId === user.selectedMessId;
  });

  const handleGenerateBills = () => {
    generateBillsForMonth(currentMonth);
    toast({
      title: "Bills Generated",
      description: `Bills for ${currentMonth} have been generated successfully`,
    });
  };

  const handleRemoveStudent = (studentId: string, studentName: string) => {
    // Remove student from mess by clearing their selectedMessId
    updateUser(studentId, { selectedMessId: undefined });
    
    toast({
      title: "Student Removed",
      description: `${studentName} has been removed from ${user.messName}`,
    });
    
    // Force refresh to update the UI
    window.location.reload();
  };

  // Group meals by student for admin view (only from same mess)
  const studentMealsGrouped = todaysStudentMeals.reduce((acc, meal) => {
    const student = messStudents.find(u => u.id === meal.userId);
    if (student) {
      if (!acc[student.id]) {
        acc[student.id] = {
          student,
          meals: [],
          totalAmount: 0
        };
      }
      acc[student.id].meals.push(meal);
      acc[student.id].totalAmount += meal.price;
    }
    return acc;
  }, {} as Record<string, { student: any, meals: any[], totalAmount: number }>);

  if (isSuperAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Welcome Super Admin! Use the navigation to manage messes and admin access.
          </p>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Managing: <span className="font-semibold text-mess-primary">{user.messName}</span>
            </p>
          </div>
          <Badge variant="outline">Today: {new Date().toLocaleDateString()}</Badge>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-500" />
                <div className="ml-2">
                  <p className="text-xs font-medium text-muted-foreground">Active Students</p>
                  <p className="text-lg font-bold">{uniqueStudentsToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Utensils className="h-6 w-6 text-green-500" />
                <div className="ml-2">
                  <p className="text-xs font-medium text-muted-foreground">Today's Meals</p>
                  <p className="text-lg font-bold">{todaysStudentMeals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-yellow-500" />
                <div className="ml-2">
                  <p className="text-xs font-medium text-muted-foreground">Today's Revenue</p>
                  <p className="text-lg font-bold">₹{todaysRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Receipt className="h-6 w-6 text-purple-500" />
                <div className="ml-2">
                  <p className="text-xs font-medium text-muted-foreground">Monthly Bills</p>
                  <p className="text-lg font-bold">{currentMonthBills.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button onClick={handleGenerateBills} size="sm">
                Generate Bills
              </Button>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                Send Notifications
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Student Management Section */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <UserMinus className="mr-2 h-5 w-5 text-orange-500" />
              Student Management - {user.messName}
            </CardTitle>
            <CardDescription className="text-sm">
              Manage students in your mess ({messStudents.length} students)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {messStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {messStudents.map((student) => (
                  <div key={student.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{student.name}</h4>
                        <p className="text-xs text-muted-foreground">{student.studentId}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">{student.email}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveStudent(student.id, student.name)}
                        className="h-6 px-2 text-xs"
                      >
                        <UserMinus className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">No students registered to {user.messName} yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Orders Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-4 w-4" />
              Today's Student Orders Summary - {user.messName}
            </CardTitle>
            <CardDescription className="text-sm">
              Grouped orders from {messStudents.length} registered students
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {Object.keys(studentMealsGrouped).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(studentMealsGrouped).map(({ student, meals, totalAmount }) => (
                  <div key={student.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">{student.name}</h4>
                        <p className="text-xs text-muted-foreground">{student.studentId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">₹{totalAmount}</p>
                        <Badge variant="outline" className="text-xs">{meals.length} items</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {meals.map((meal, index) => (
                        <div key={index} className="flex justify-between items-center text-xs bg-white dark:bg-gray-700 p-1 rounded">
                          <span>{meal.menuItemName}</span>
                          <span className="font-medium">₹{meal.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Utensils className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">No orders today from {user.messName} students</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Bills Section - CORRECTED FILTERING */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Receipt className="mr-2 h-4 w-4" />
              Monthly Bills - {currentMonth} ({user.messName} students only)
            </CardTitle>
            <CardDescription className="text-sm">
              Bills for students currently registered to {user.messName} ({currentMonthBills.length} bills)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {currentMonthBills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentMonthBills.map((bill) => (
                  <div key={bill.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">{bill.studentName}</h4>
                        <p className="text-xs text-muted-foreground">{user.messName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">₹{bill.totalAmount}</p>
                        <Badge variant={bill.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                          {bill.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Items: {bill.items.length}</span>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Receipt className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">No bills generated yet for {user.messName} students</p>
                <Button onClick={handleGenerateBills} size="sm" className="mt-2 text-xs">
                  Generate Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isStudent) {
    const userMeals = todaysMeals.filter(meal => meal.userId === user.id);
    const userTotal = userMeals.reduce((sum, meal) => sum + meal.price, 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <Badge variant="outline">Today: {new Date().toLocaleDateString()}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Utensils className="h-8 w-8 text-mess-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Today's Meals</p>
                  <p className="text-2xl font-bold">{userMeals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Today's Total</p>
                  <p className="text-2xl font-bold">₹{userTotal}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Last Meal</p>
                  <p className="text-lg font-bold">
                    {userMeals.length > 0 ? userMeals[userMeals.length - 1].mealType : 'None'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {userMeals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Today's Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userMeals.map((meal, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded">
                    <div>
                      <p className="font-medium">{meal.menuItemName}</p>
                      <p className="text-sm text-muted-foreground capitalize">{meal.mealType}</p>
                    </div>
                    <p className="font-bold">₹{meal.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Welcome to the Mess Management System!</p>
    </div>
  );
};

export default Dashboard;


import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Receipt, Send, Download, Users, Calendar, Filter } from "lucide-react";
import { getAllBills, generateBillsForMonth, sendBillNotifications } from "@/services";

const BillManagement = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');

  if (!user || !isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const allBills = getAllBills();
  const filteredBills = allBills.filter(bill => {
    const monthMatch = bill.month === selectedMonth;
    const statusMatch = filterStatus === 'all' || bill.status === filterStatus;
    return monthMatch && statusMatch;
  });

  const handleGenerateBills = () => {
    generateBillsForMonth(selectedMonth);
    toast({
      title: "Bills Generated",
      description: `Bills for ${selectedMonth} have been generated successfully`,
    });
  };

  const handleSendNotifications = () => {
    const pendingBills = filteredBills.filter(bill => bill.status === 'pending');
    sendBillNotifications(pendingBills.map(bill => bill.id));
    toast({
      title: "Notifications Sent",
      description: `Sent ${pendingBills.length} bill notifications`,
    });
  };

  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const pendingAmount = filteredBills.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.totalAmount, 0);
  const paidAmount = filteredBills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.totalAmount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center">
        <Receipt className="mr-2 h-6 w-6 text-mess-primary" />
        Bill Management
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Bills</p>
                <p className="text-2xl font-bold">{filteredBills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">₹{totalAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">₹{pendingAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">₹{paidAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Bill Generation & Management</CardTitle>
          <CardDescription>Generate and manage student bills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Select Month</Label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Filter by Status</Label>
              <select
                id="status"
                className="w-full p-2 border border-input rounded-md bg-background"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'paid')}
              >
                <option value="all">All Bills</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="flex flex-col justify-end space-y-2">
              <Button onClick={handleGenerateBills} className="w-full">
                <Receipt className="mr-2 h-4 w-4" />
                Generate Bills
              </Button>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleSendNotifications} 
              variant="outline"
              disabled={filteredBills.filter(bill => bill.status === 'pending').length === 0}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Notifications ({filteredBills.filter(bill => bill.status === 'pending').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bills List */}
      <Card>
        <CardHeader>
          <CardTitle>Bills for {selectedMonth}</CardTitle>
          <CardDescription>
            Showing {filteredBills.length} bills
            {filterStatus !== 'all' && ` (${filterStatus})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBills.length > 0 ? (
            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <div key={bill.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{bill.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{bill.messName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{bill.totalAmount}</p>
                      <Badge variant={bill.status === 'paid' ? 'default' : 'secondary'}>
                        {bill.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Generated: {new Date(bill.generatedAt).toLocaleDateString()}</span>
                    <span>Downloads: {bill.downloadCount}</span>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Send className="mr-1 h-3 w-3" />
                      Send
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No bills found for the selected criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillManagement;

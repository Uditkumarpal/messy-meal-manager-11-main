import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Key, Trash2, Settings, Users, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";
import { getMesses, createMess, deleteMess, updateMess, getAdminKeys } from "@/services";
import { getAdminRequests, updateAdminRequest, type AdminRequest } from "@/services/messagingService";

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messName, setMessName] = useState("");
  const [facilities, setFacilities] = useState("");
  const [description, setDescription] = useState("");
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  if (!user || user.role !== 'super-admin') {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Access denied. Super Admin privileges required.</p>
      </div>
    );
  }

  const messes = getMesses();
  const adminKeys = getAdminKeys();
  const adminRequests = getAdminRequests();

  const handleCreateMess = () => {
    if (!messName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter mess name",
      });
      return;
    }

    const facilitiesList = facilities.split(",").map(f => f.trim()).filter(f => f);
    createMess(messName, facilitiesList, description);
    
    toast({
      title: "Mess Created",
      description: `${messName} has been created successfully with admin key`,
    });

    // Reset form
    setMessName("");
    setFacilities("");
    setDescription("");
  };

  const handleDeleteMess = (messId: string, messName: string) => {
    deleteMess(messId);
    toast({
      title: "Mess Deleted",
      description: `${messName} has been removed`,
    });
  };

  const toggleMessStatus = (messId: string, currentStatus: boolean) => {
    updateMess(messId, { isActive: !currentStatus });
    toast({
      title: "Mess Updated",
      description: `Mess status has been ${!currentStatus ? "activated" : "deactivated"}`,
    });
  };

  const toggleKey = (messId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [messId]: !prev[messId]
    }));
  };

  const handleApproveRequest = (request: AdminRequest) => {
    // Create the mess first
    const facilitiesList = ["Breakfast", "Lunch", "Dinner"];
    createMess(request.messName, facilitiesList, `Managed by ${request.adminName}`);
    
    // Update the request status
    updateAdminRequest(request.id, {
      requestStatus: 'approved',
      paymentStatus: 'paid'
    });

    toast({
      title: "Request Approved",
      description: `Admin access granted for ${request.messName}`,
    });
  };

  const handleRejectRequest = (requestId: string) => {
    updateAdminRequest(requestId, {
      requestStatus: 'rejected'
    });

    toast({
      title: "Request Rejected",
      description: "Admin request has been rejected",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Building2 className="mr-2 h-6 w-6 text-mess-primary" />
          Super Admin Dashboard
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-mess-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Messes</p>
                <p className="text-2xl font-bold">{messes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Messes</p>
                <p className="text-2xl font-bold">{messes.filter(m => m.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Key className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Admin Keys</p>
                <p className="text-2xl font-bold">{adminKeys.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{adminRequests.filter(r => r.requestStatus === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Requests */}
      {adminRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Admin Requests
            </CardTitle>
            <CardDescription>Review and approve new admin applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{request.messName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Requested by: {request.adminName} ({request.adminEmail})
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={
                        request.requestStatus === 'approved' ? 'default' :
                        request.requestStatus === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {request.requestStatus}
                      </Badge>
                      <Badge variant={
                        request.paymentStatus === 'paid' ? 'default' :
                        request.paymentStatus === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {request.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{request.businessDetails}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Submitted: {new Date(request.createdAt).toLocaleDateString()}
                  </p>

                  {request.requestStatus === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(request)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve & Create Mess
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Mess */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Create New Mess
          </CardTitle>
          <CardDescription>Add a new mess and generate admin access key</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="messName">Mess Name *</Label>
              <Input
                id="messName"
                placeholder="e.g., North Campus Mess"
                value={messName}
                onChange={(e) => setMessName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facilities">Facilities</Label>
              <Input
                id="facilities"
                placeholder="Comma separated (e.g., Breakfast, Lunch, Dinner)"
                value={facilities}
                onChange={(e) => setFacilities(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the mess"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button onClick={handleCreateMess} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create Mess & Generate Admin Key
          </Button>
        </CardContent>
      </Card>

      {/* Messes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messes.map((mess) => (
          <Card key={mess.id} className={`${mess.isActive ? '' : 'opacity-60'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{mess.name}</CardTitle>
                <Badge variant={mess.isActive ? "default" : "secondary"}>
                  {mess.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>
                Created: {new Date(mess.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mess.description && (
                <p className="text-sm text-muted-foreground">{mess.description}</p>
              )}
              
              <div>
                <h4 className="font-medium mb-2">Facilities:</h4>
                <div className="flex flex-wrap gap-2">
                  {mess.facilities.map((facility, index) => (
                    <Badge key={index} variant="outline">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Admin Access Key:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleKey(mess.id)}
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                </div>
                {showKeys[mess.id] && (
                  <div className="bg-muted p-2 rounded text-xs font-mono break-all">
                    {mess.adminKey}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleMessStatus(mess.id, mess.isActive)}
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {mess.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteMess(mess.id, mess.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {messes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No messes created yet</p>
            <p className="text-sm text-muted-foreground mt-2">Create your first mess above</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SuperAdminDashboard;

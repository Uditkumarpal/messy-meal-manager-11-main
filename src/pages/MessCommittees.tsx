
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Key, Trash2, Settings } from "lucide-react";
import { getMessCommittees, createMessCommittee, deleteMessCommittee, updateMessCommittee } from "@/services";

const MessCommittees = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [committeeName, setCommitteeName] = useState("");
  const [facilities, setFacilities] = useState("");
  const [showAdminKeys, setShowAdminKeys] = useState<{ [key: string]: boolean }>({});

  if (!user) return null;

  const committees = getMessCommittees();

  const handleCreateCommittee = () => {
    if (!committeeName.trim() || !facilities.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in committee name and facilities",
      });
      return;
    }

    const facilitiesList = facilities.split(",").map(f => f.trim()).filter(f => f);
    createMessCommittee(committeeName, facilitiesList);
    
    toast({
      title: "Committee Created",
      description: `${committeeName} has been created successfully`,
    });

    setCommitteeName("");
    setFacilities("");
  };

  const handleDeleteCommittee = (committeeId: string, committeeName: string) => {
    deleteMessCommittee(committeeId);
    toast({
      title: "Committee Deleted",
      description: `${committeeName} has been removed`,
    });
  };

  const toggleCommitteeStatus = (committeeId: string, currentStatus: boolean) => {
    updateMessCommittee(committeeId, { isActive: !currentStatus });
    toast({
      title: "Committee Updated",
      description: `Committee status has been ${!currentStatus ? "activated" : "deactivated"}`,
    });
  };

  const toggleAdminKey = (committeeId: string) => {
    setShowAdminKeys(prev => ({
      ...prev,
      [committeeId]: !prev[committeeId]
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center">
        <Building2 className="mr-2 h-6 w-6 text-mess-primary" />
        Mess Committees Management
      </h1>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Create New Committee
            </CardTitle>
            <CardDescription>Add a new mess committee with different facilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Committee name (e.g., North Campus Mess)"
              value={committeeName}
              onChange={(e) => setCommitteeName(e.target.value)}
            />

            <Input
              placeholder="Facilities (comma separated, e.g., Breakfast, Lunch, Dinner, Snacks)"
              value={facilities}
              onChange={(e) => setFacilities(e.target.value)}
            />

            <Button onClick={handleCreateCommittee} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Committee
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Committees List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {committees.map((committee) => (
          <Card key={committee.id} className={`${committee.isActive ? '' : 'opacity-60'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{committee.name}</CardTitle>
                <Badge variant={committee.isActive ? "default" : "secondary"}>
                  {committee.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>
                Created: {new Date(committee.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Facilities:</h4>
                <div className="flex flex-wrap gap-2">
                  {committee.facilities.map((facility, index) => (
                    <Badge key={index} variant="outline">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>

              {isAdmin && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Admin Key:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAdminKey(committee.id)}
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                  {showAdminKeys[committee.id] && (
                    <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                      {committee.adminKey}
                    </div>
                  )}
                </div>
              )}

              {isAdmin && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCommitteeStatus(committee.id, committee.isActive)}
                    className="flex-1"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    {committee.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCommittee(committee.id, committee.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {committees.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No mess committees created yet</p>
            {isAdmin && (
              <p className="text-sm text-gray-400 mt-2">Create your first committee above</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MessCommittees;

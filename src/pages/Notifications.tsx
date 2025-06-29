
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Plus, Trash2, AlertTriangle } from "lucide-react";
import { createNotification, getNotifications, deleteNotification } from "@/services";

const Notifications = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  if (!user || !isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const notifications = getNotifications();

  const handleCreateNotification = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in both title and content",
      });
      return;
    }

    createNotification(title, content, priority);
    toast({
      title: "Notification Created",
      description: "Important notification has been posted for all students",
    });

    setTitle("");
    setContent("");
    setPriority("medium");
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
    toast({
      title: "Notification Deleted",
      description: "Notification has been removed",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center">
        <Bell className="mr-2 h-6 w-6 text-mess-primary" />
        Notification Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Create Important Notification
            </CardTitle>
            <CardDescription>Create pinned notifications for all students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Enter notification content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />

            <Button onClick={handleCreateNotification} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </CardContent>
        </Card>

        {/* Active Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Active Notifications ({notifications.length})</CardTitle>
            <CardDescription>Manage existing notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                          {notification.priority.toUpperCase()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{notification.content}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No notifications created yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;

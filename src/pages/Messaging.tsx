
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Mail } from "lucide-react";
import { sendMessage, getUserMessages, markMessageAsRead } from "@/services/messagingService";
import { getUsers } from "@/services/userService";
import { Message } from "@/types";

const Messaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  if (!user) return null;

  // Get users from the same mess only - filter by selectedMessId
  const allUsers = getUsers();
  const messUsers = allUsers.filter(u => 
    u.id !== user.id && 
    user.selectedMessId && 
    u.selectedMessId === user.selectedMessId
  );

  const userMessages = getUserMessages(user.id);
  const receivedMessages = userMessages.filter(msg => msg.receiverId === user.id);
  const sentMessages = userMessages.filter(msg => msg.senderId === user.id);

  const handleSendMessage = () => {
    if (!selectedReceiver || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a receiver and enter message content",
      });
      return;
    }

    sendMessage(user.id, selectedReceiver, content, subject);
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully",
    });

    setSelectedReceiver("");
    setSubject("");
    setContent("");
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (message.receiverId === user.id && !message.isRead) {
      markMessageAsRead(message.id);
    }
  };

  const getUserName = (userId: string) => {
    const foundUser = allUsers.find(u => u.id === userId);
    return foundUser?.name || "Unknown User";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center">
        <MessageCircle className="mr-2 h-6 w-6 text-mess-primary" />
        Messaging - {user.messName || 'Your Mess'}
      </h1>

      {messUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No other users in your mess to message</p>
          </CardContent>
        </Card>
      )}

      {messUsers.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Send Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </CardTitle>
              <CardDescription>Send a message to users in your mess</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedReceiver} onValueChange={setSelectedReceiver}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {messUsers.map((recipient) => (
                    <SelectItem key={recipient.id} value={recipient.id}>
                      {recipient.name} ({recipient.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Subject (optional)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <Textarea
                placeholder="Enter your message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />

              <Button onClick={handleSendMessage} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Message Details */}
          <Card>
            <CardHeader>
              <CardTitle>Message Details</CardTitle>
              <CardDescription>
                {selectedMessage ? "Message content" : "Select a message to view"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">From: {getUserName(selectedMessage.senderId)}</p>
                    <p className="font-semibold">To: {getUserName(selectedMessage.receiverId)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedMessage.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>{selectedMessage.content}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Select a message from the inbox or sent items to view its content
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {messUsers.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inbox */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Inbox ({receivedMessages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {receivedMessages.length > 0 ? (
                  receivedMessages
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                          !message.isRead ? "bg-blue-50 border-blue-200" : ""
                        } ${selectedMessage?.id === message.id ? "ring-2 ring-mess-primary" : ""}`}
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{getUserName(message.senderId)}</p>
                            <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No messages received</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Sent Messages ({sentMessages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sentMessages.length > 0 ? (
                  sentMessages
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                          selectedMessage?.id === message.id ? "ring-2 ring-mess-primary" : ""
                        }`}
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">To: {getUserName(message.receiverId)}</p>
                            <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No messages sent</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Messaging;

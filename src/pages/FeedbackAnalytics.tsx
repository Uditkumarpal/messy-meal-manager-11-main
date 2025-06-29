
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMenuItems } from "@/services";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const FeedbackAnalytics = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const menuItems = getMenuItems();
  const filteredItems = categoryFilter === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === categoryFilter);

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aLikes = a.likes || 0;
    const bLikes = b.likes || 0;
    return bLikes - aLikes;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu Item Feedback Analytics</h1>
        <div className="w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snacks">Snacks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => {
            const likes = item.likes || 0;
            const dislikes = item.dislikes || 0;
            const totalFeedback = likes + dislikes;
            const likePercentage = totalFeedback > 0 ? Math.round((likes / totalFeedback) * 100) : 0;
            
            return (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>
                        <span className="capitalize">{item.category}</span> · ₹{item.price}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${likePercentage >= 70 ? 'text-green-500' : likePercentage >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
                        {likePercentage}% Positive
                      </span>
                      <CardDescription>
                        {totalFeedback} total feedback
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{item.description}</p>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-200 rounded-full h-5 w-64 md:w-96">
                          <div 
                            className="bg-green-500 h-5 rounded-full" 
                            style={{ width: `${likePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />
                          <span>{likes}</span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsDown className="h-5 w-5 text-red-500 mr-2" />
                          <span>{dislikes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-gray-500">No menu items found with the selected filter</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeedbackAnalytics;

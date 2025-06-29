
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Utensils, Plus, ShoppingCart } from "lucide-react";
import { getMenuItems, recordStudentMeal } from "@/services";

const StudentOrdering = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState<string[]>([]);

  if (!user || user.role !== 'student') {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Access denied. Student privileges required.</p>
      </div>
    );
  }

  const menuItems = getMenuItems().filter(item => item.available);

  const addToCart = (itemId: string) => {
    setCart(prev => [...prev, itemId]);
    const item = menuItems.find(m => m.id === itemId);
    toast({
      title: "Added to order",
      description: `${item?.name} added to your order`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const index = prev.indexOf(itemId);
      if (index > -1) {
        const newCart = [...prev];
        newCart.splice(index, 1);
        return newCart;
      }
      return prev;
    });
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Order",
        description: "Please add items to your order first",
      });
      return;
    }

    cart.forEach(itemId => {
      recordStudentMeal(user.id, itemId);
    });

    toast({
      title: "Order Placed",
      description: `Successfully ordered ${cart.length} items`,
    });

    setCart([]);
  };

  const getCartItemCount = (itemId: string) => {
    return cart.filter(id => id === itemId).length;
  };

  const cartTotal = cart.reduce((total, itemId) => {
    const item = menuItems.find(m => m.id === itemId);
    return total + (item?.price || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Utensils className="mr-2 h-6 w-6 text-mess-primary" />
          Order Your Meals
        </h1>
        {cart.length > 0 && (
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {cart.length} items - ₹{cartTotal}
            </Badge>
            <Button onClick={placeOrder} className="bg-mess-primary hover:bg-mess-dark">
              Place Order
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {item.category}
                </Badge>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-mess-primary">₹{item.price}</span>
                <div className="flex items-center space-x-2">
                  {item.likes && (
                    <Badge variant="secondary">👍 {item.likes}</Badge>
                  )}
                  {item.dislikes && (
                    <Badge variant="secondary">👎 {item.dislikes}</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => addToCart(item.id)}
                  className="flex-1 mr-2"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Order
                </Button>
                {getCartItemCount(item.id) > 0 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      variant="outline"
                      size="sm"
                    >
                      -
                    </Button>
                    <span className="font-bold">{getCartItemCount(item.id)}</span>
                    <Button
                      onClick={() => addToCart(item.id)}
                      variant="outline"
                      size="sm"
                    >
                      +
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {menuItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Utensils className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No menu items available at the moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentOrdering;

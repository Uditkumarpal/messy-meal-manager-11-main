
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getMenuItems, saveMenuItem, deleteMenuItem } from "@/services";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { MenuItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

const MenuManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getMenuItems());
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const initialItemState: MenuItem = {
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "breakfast",
    available: true,
  };

  const [formData, setFormData] = useState<MenuItem>(initialItemState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as "breakfast" | "lunch" | "dinner" | "snacks",
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      available: checked,
    }));
  };

  const handleAddNew = () => {
    setFormData(initialItemState);
    setSelectedItem(null);
    setIsEditing(true);
  };

  const handleEdit = (item: MenuItem) => {
    setFormData(item);
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a name for the menu item",
      });
      return;
    }

    saveMenuItem(formData);
    setMenuItems(getMenuItems());
    setIsEditing(false);
    setSelectedItem(null);
    
    toast({
      title: "Success",
      description: `Menu item ${formData.id ? "updated" : "added"} successfully`,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      deleteMenuItem(id);
      setMenuItems(getMenuItems());
      
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        {!isEditing && (
          <Button onClick={handleAddNew} className="bg-mess-primary hover:bg-mess-dark">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedItem ? "Edit Menu Item" : "Add New Menu Item"}</CardTitle>
            <CardDescription>
              {selectedItem
                ? "Update the details of the existing menu item"
                : "Fill in the details to add a new menu item"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter item description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={handleSelectChange}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snacks">Snacks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="available" className="cursor-pointer">Available</Label>
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
              
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-mess-secondary hover:bg-green-600">
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.id} className={`overflow-hidden ${!item.available && 'opacity-70'}`}>
              <CardHeader className={`pb-2 ${item.available ? 'bg-mess-light' : 'bg-gray-200'}`}>
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(item)}
                      className="h-7 w-7"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(item.id)}
                      className="h-7 w-7 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <CardDescription>
                    <span className="capitalize">{item.category}</span>
                  </CardDescription>
                  <span className="text-sm font-semibold">₹{item.price}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-sm text-gray-600">{item.description}</p>
                <div className="mt-2 flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-500">
                    {item.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;

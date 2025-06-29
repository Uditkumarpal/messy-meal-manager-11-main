
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getMesses } from "@/services/messService";

interface MessSelectorProps {
  selectedMessId?: string;
  onMessChange: (messId: string) => void;
  required?: boolean;
}

const MessSelector = ({ selectedMessId, onMessChange, required = false }: MessSelectorProps) => {
  const messes = getMesses().filter(mess => mess.isActive);

  if (messes.length === 0) {
    return (
      <div className="space-y-2">
        <Label htmlFor="mess">Select Mess</Label>
        <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
          No active messes available. Please contact administration.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="mess">Select Mess {required && "*"}</Label>
      <Select value={selectedMessId} onValueChange={onMessChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder="Choose your mess" />
        </SelectTrigger>
        <SelectContent>
          {messes.map((mess) => (
            <SelectItem key={mess.id} value={mess.id}>
              <div className="flex flex-col">
                <span className="font-medium">{mess.name}</span>
                <span className="text-xs text-muted-foreground">
                  {mess.facilities.join(", ")}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MessSelector;

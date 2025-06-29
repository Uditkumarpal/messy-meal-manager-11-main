
import { MenuItem } from "@/types";
import { MENU_ITEMS_KEY, initializeData } from "./localStorage";

// Menu item related functions
export const getMenuItems = (): MenuItem[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(MENU_ITEMS_KEY) || "[]");
};

export const getMenuItem = (id: string): MenuItem | undefined => {
  const items = getMenuItems();
  return items.find((item) => item.id === id);
};

export const saveMenuItem = (item: MenuItem): void => {
  const items = getMenuItems();
  const index = items.findIndex((i) => i.id === item.id);
  
  if (index >= 0) {
    items[index] = item;
  } else {
    item.id = Date.now().toString();
    items.push(item);
  }
  
  localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(items));
};

export const deleteMenuItem = (id: string): void => {
  const items = getMenuItems();
  const updatedItems = items.filter((item) => item.id !== id);
  localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(updatedItems));
};

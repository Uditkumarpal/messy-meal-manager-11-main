
import { Mess, AdminKey } from "@/types";
import { initializeData } from "./localStorage";

const MESSES_KEY = "mess_messes";
const ADMIN_KEYS_KEY = "admin_keys";

// Mock initial data
const mockMesses: Mess[] = [];
const mockAdminKeys: AdminKey[] = [];

// Initialize mess data
export const initializeMessData = () => {
  if (!localStorage.getItem(MESSES_KEY)) {
    localStorage.setItem(MESSES_KEY, JSON.stringify(mockMesses));
  }
  if (!localStorage.getItem(ADMIN_KEYS_KEY)) {
    localStorage.setItem(ADMIN_KEYS_KEY, JSON.stringify(mockAdminKeys));
  }
};

// Mess functions
export const getMesses = (): Mess[] => {
  initializeMessData();
  return JSON.parse(localStorage.getItem(MESSES_KEY) || "[]");
};

export const getMessById = (messId: string): Mess | undefined => {
  const messes = getMesses();
  return messes.find(mess => mess.id === messId);
};

export const createMess = (
  name: string,
  facilities: string[], 
  description?: string
): void => {
  const messes = getMesses();
  const adminKeys = getAdminKeys();
  
  const messId = Date.now().toString();
  const key = `ADMIN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const newMess: Mess = {
    id: messId,
    name,
    adminKey: key,
    facilities,
    isActive: true,
    createdAt: new Date().toISOString(),
    description,
  };

  const newAdminKey: AdminKey = {
    id: (Date.now() + 1).toString(),
    key,
    messId,
    messName: name,
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  messes.push(newMess);
  adminKeys.push(newAdminKey);
  
  localStorage.setItem(MESSES_KEY, JSON.stringify(messes));
  localStorage.setItem(ADMIN_KEYS_KEY, JSON.stringify(adminKeys));
};

export const updateMess = (messId: string, updates: Partial<Mess>): void => {
  const messes = getMesses();
  const index = messes.findIndex(mess => mess.id === messId);
  
  if (index >= 0) {
    messes[index] = { ...messes[index], ...updates };
    localStorage.setItem(MESSES_KEY, JSON.stringify(messes));
  }
};

export const deleteMess = (messId: string): void => {
  const messes = getMesses();
  const adminKeys = getAdminKeys();
  
  const updatedMesses = messes.filter(mess => mess.id !== messId);
  const updatedKeys = adminKeys.filter(key => key.messId !== messId);
  
  localStorage.setItem(MESSES_KEY, JSON.stringify(updatedMesses));
  localStorage.setItem(ADMIN_KEYS_KEY, JSON.stringify(updatedKeys));
};

// Admin Key functions
export const getAdminKeys = (): AdminKey[] => {
  initializeMessData();
  return JSON.parse(localStorage.getItem(ADMIN_KEYS_KEY) || "[]");
};

export const validateAdminKey = (key: string): AdminKey | undefined => {
  const adminKeys = getAdminKeys();
  return adminKeys.find(adminKey => adminKey.key === key && adminKey.isActive);
};

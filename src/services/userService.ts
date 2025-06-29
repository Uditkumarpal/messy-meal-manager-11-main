
import { User } from "@/types";
import { USERS_KEY, initializeData } from "./localStorage";
import { validateAdminKey } from "./messService";

// Current user session
let currentUser: User | null = null;

// User related functions
export const getUsers = (): User[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
};

export const getUser = (id: string): User | undefined => {
  const users = getUsers();
  return users.find((user) => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find((user) => user.email === email);
};

export const validateUser = (email: string, password: string): User | undefined => {
  const users = getUsers();
  console.log('Available users:', users.map(u => ({ email: u.email, role: u.role })));
  console.log('Validating user with email:', email, 'password:', password);
  
  const user = users.find((user) => user.email === email && user.password === password);
  console.log('Validation result:', user ? { email: user.email, role: user.role } : 'Not found');
  
  return user;
};

export const validateAdminWithKey = (email: string, password: string, adminKey: string): User | undefined => {
  const user = validateUser(email, password);
  if (user && user.role === 'admin') {
    const keyValidation = validateAdminKey(adminKey);
    if (keyValidation) {
      // Set the mess information for the admin
      return { 
        ...user, 
        adminKey,
        selectedMessId: keyValidation.messId,
        messName: keyValidation.messName
      };
    }
  }
  return undefined;
};

export const login = (email: string, password?: string, adminKey?: string): User | null => {
  let user: User | undefined;
  
  if (adminKey) {
    user = validateAdminWithKey(email, password || "", adminKey);
  } else {
    user = validateUser(email, password || "");
  }
  
  if (user) {
    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
    console.log('User logged in successfully:', { email: user.email, role: user.role, mess: user.messName });
    return user;
  }
  console.log('Login failed for email:', email);
  return null;
};

export const logout = (): void => {
  currentUser = null;
  localStorage.removeItem("currentUser");
};

export const getCurrentUser = (): User | null => {
  if (currentUser) {
    return currentUser;
  }
  
  const stored = localStorage.getItem("currentUser");
  if (stored) {
    currentUser = JSON.parse(stored);
    return currentUser;
  }
  
  return null;
};

export const registerStudent = (name: string, email: string, studentId: string, password: string, selectedMessId?: string): User | null => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(user => user.email === email)) {
    console.log('Email already exists:', email);
    return null;
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password,
    role: 'student',
    studentId,
    selectedMessId
  };
  
  console.log('Registering new user:', newUser);
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Update current user session
  currentUser = newUser;
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  
  return newUser;
};

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const users = getUsers();
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return undefined;
  }

  users[userIndex] = { ...users[userIndex], ...updates };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users[userIndex];
};

export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const initialLength = users.length;
  const updatedUsers = users.filter((user) => user.id !== id);

  if (updatedUsers.length === initialLength) {
    return false;
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  return true;
};

// Function to reset data (useful for testing)
export const resetUserData = (): void => {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem("currentUser");
  currentUser = null;
  initializeData();
};

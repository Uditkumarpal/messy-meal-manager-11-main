
import { Message, Notification, MessCommittee } from "@/types";
import { getUsers } from "./userService";

const MESSAGES_KEY = "mess_messages";
const NOTIFICATIONS_KEY = "mess_notifications";
const COMMITTEES_KEY = "mess_committees";
const ADMIN_REQUESTS_KEY = "admin_requests";

// Initialize with sample data
export const initializeMessagingData = () => {
  if (!localStorage.getItem(MESSAGES_KEY)) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(COMMITTEES_KEY)) {
    const defaultCommittees: MessCommittee[] = [
      {
        id: "1",
        name: "Main Mess Committee",
        facilities: ["Breakfast", "Lunch", "Dinner"],
        adminKey: "MAIN_MESS_2024",
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    ];
    localStorage.setItem(COMMITTEES_KEY, JSON.stringify(defaultCommittees));
  }
  if (!localStorage.getItem(ADMIN_REQUESTS_KEY)) {
    localStorage.setItem(ADMIN_REQUESTS_KEY, JSON.stringify([]));
  }
};

// Get users from the same mess only
export const getMessUsers = (currentUserMessId?: string): any[] => {
  if (!currentUserMessId) return [];
  
  const allUsers = getUsers();
  return allUsers.filter(user => user.selectedMessId === currentUserMessId);
};

// Message functions
export const getMessages = (): Message[] => {
  initializeMessagingData();
  return JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
};

export const sendMessage = (senderId: string, receiverId: string, content: string, subject?: string): Message => {
  const messages = getMessages();
  const newMessage: Message = {
    id: Date.now().toString(),
    senderId,
    receiverId,
    content,
    subject: subject || "No Subject",
    timestamp: new Date().toISOString(),
    isRead: false,
  };
  
  messages.push(newMessage);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  return newMessage;
};

export const getUserMessages = (userId: string): Message[] => {
  const messages = getMessages();
  return messages.filter(msg => msg.receiverId === userId || msg.senderId === userId);
};

export const markMessageAsRead = (messageId: string) => {
  const messages = getMessages();
  const messageIndex = messages.findIndex(msg => msg.id === messageId);
  if (messageIndex !== -1) {
    messages[messageIndex].isRead = true;
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }
};

// Notification functions
export const getNotifications = (): Notification[] => {
  initializeMessagingData();
  return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
};

export const createNotification = (title: string, content: string, priority: "low" | "medium" | "high" = "medium"): Notification => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    id: Date.now().toString(),
    title,
    content,
    priority,
    isPinned: true,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  
  notifications.unshift(newNotification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  return newNotification;
};

export const getPinnedNotifications = (): Notification[] => {
  return getNotifications().filter(notification => notification.isPinned && notification.isActive);
};

export const deleteNotification = (notificationId: string) => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
};

// Admin request functions
export interface AdminRequest {
  id: string;
  messName: string;
  adminName: string;
  adminEmail: string;
  businessDetails: string;
  paymentStatus: 'pending' | 'paid' | 'rejected';
  requestStatus: 'pending' | 'approved' | 'rejected';
  adminKey?: string;
  createdAt: string;
}

export const getAdminRequests = (): AdminRequest[] => {
  initializeMessagingData();
  return JSON.parse(localStorage.getItem(ADMIN_REQUESTS_KEY) || "[]");
};

export const createAdminRequest = (messName: string, adminName: string, adminEmail: string, businessDetails: string): AdminRequest => {
  const requests = getAdminRequests();
  const newRequest: AdminRequest = {
    id: Date.now().toString(),
    messName,
    adminName,
    adminEmail,
    businessDetails,
    paymentStatus: 'pending',
    requestStatus: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  requests.push(newRequest);
  localStorage.setItem(ADMIN_REQUESTS_KEY, JSON.stringify(requests));
  return newRequest;
};

export const updateAdminRequest = (requestId: string, updates: Partial<AdminRequest>) => {
  const requests = getAdminRequests();
  const requestIndex = requests.findIndex(req => req.id === requestId);
  if (requestIndex !== -1) {
    requests[requestIndex] = { ...requests[requestIndex], ...updates };
    localStorage.setItem(ADMIN_REQUESTS_KEY, JSON.stringify(requests));
  }
};

// Mess Committee functions
export const getMessCommittees = (): MessCommittee[] => {
  initializeMessagingData();
  return JSON.parse(localStorage.getItem(COMMITTEES_KEY) || "[]");
};

export const createMessCommittee = (name: string, facilities: string[]): MessCommittee => {
  const committees = getMessCommittees();
  const newCommittee: MessCommittee = {
    id: Date.now().toString(),
    name,
    facilities,
    adminKey: `${name.toUpperCase().replace(/\s+/g, '_')}_${Date.now()}`,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  
  committees.push(newCommittee);
  localStorage.setItem(COMMITTEES_KEY, JSON.stringify(committees));
  return newCommittee;
};

export const updateMessCommittee = (committeeId: string, updates: Partial<MessCommittee>) => {
  const committees = getMessCommittees();
  const committeeIndex = committees.findIndex(committee => committee.id === committeeId);
  if (committeeIndex !== -1) {
    committees[committeeIndex] = { ...committees[committeeIndex], ...updates };
    localStorage.setItem(COMMITTEES_KEY, JSON.stringify(committees));
  }
};

export const deleteMessCommittee = (committeeId: string) => {
  const committees = getMessCommittees();
  const updatedCommittees = committees.filter(committee => committee.id !== committeeId);
  localStorage.setItem(COMMITTEES_KEY, JSON.stringify(committees));
};

export const verifyAdminKey = (committeeId: string, key: string): boolean => {
  const committees = getMessCommittees();
  const committee = committees.find(c => c.id === committeeId);
  return committee ? committee.adminKey === key : false;
};

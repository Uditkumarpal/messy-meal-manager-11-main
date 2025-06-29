
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  subject: string;
  timestamp: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  isPinned: boolean;
  createdAt: string;
  isActive: boolean;
}

export interface MessCommittee {
  id: string;
  name: string;
  facilities: string[];
  adminKey: string;
  isActive: boolean;
  createdAt: string;
}

// types/database.ts
export interface DatabaseUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseChat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}

export interface DatabaseMessage {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  metadata: Record<string, any>;
}

export interface DatabaseFile {
  id: string;
  message_id: string;
  filename: string;
  url: string;
  media_type: string;
  size: number | null;
  created_at: string;
}

// types/database.ts
export interface Chat {
  id: string;
  user_id: string;
  title: string;
  is_archived: boolean;
  model_used: string | null;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export interface Message {
  id: string;
  chat_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Record<string, any>;
  created_at: string;
  files?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  message_id: string;
  filename: string;
  url: string;
  mediaType: string;
  size: number;
  created_at: string;
}

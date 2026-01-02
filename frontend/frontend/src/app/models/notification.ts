export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  category: 'FINANCIAL' | 'ADMINISTRATIVE' | 'SUPPORT' | 'GENERAL';
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  is_read: boolean;
  action_url?: string;
  created_at: string;
  read_at?: string;
  read: boolean;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  categories: {
    financial: boolean;
    administrative: boolean;
    support: boolean;
    general: boolean;
  };
}

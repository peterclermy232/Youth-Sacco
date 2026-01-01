export interface UserSettings {
  id?: number;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  notify_contributions: boolean;
  notify_approvals: boolean;
  notify_reports: boolean;
  notify_updates: boolean;
  language: string;
  theme: 'LIGHT' | 'DARK' | 'AUTO';
  currency: string;
  profile_visibility: 'PUBLIC' | 'MEMBERS' | 'PRIVATE';
  two_factor_enabled: boolean;
  biometric_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IntegratedFirm {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  integration_type: 'BANK' | 'INVESTMENT' | 'INSURANCE' | 'OTHER';
  shares_financial_data: boolean;
  shares_member_data: boolean;
  created_at: string;
  updated_at: string;
}

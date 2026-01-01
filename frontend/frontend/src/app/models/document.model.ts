export interface DocumentCategory {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  requires_verification: boolean;
  created_at: string;
}

export interface Document {
  id: number;
  user: number;
  user_details?: any;
  category: number;
  category_name?: string;
  title: string;
  description?: string;
  file: string;
  file_url?: string;
  file_size: number;
  file_type: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  verified_by?: number;
  verified_by_name?: string;
  verified_at?: string;
  rejection_reason?: string;
  document_number?: string;
  issue_date?: string;
  expiry_date?: string;
  version: number;
  replaced_by?: number;
  uploaded_at: string;
  updated_at: string;
}

export interface DocumentUpload {
  category: number;
  title: string;
  description?: string;
  file: File;
  document_number?: string;
  issue_date?: string;
  expiry_date?: string;
}

export interface DocumentVerification {
  status: 'VERIFIED' | 'REJECTED';
  rejection_reason?: string;
}

export interface GroupedDocuments {
  [category: string]: Document[];
}

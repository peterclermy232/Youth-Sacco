export interface Application {
  id: number;
  user: number;
  user_details?: any;
  application_type: 'ENTRY' | 'EXIT';
  application_type_display?: string;
  full_name: string;
  phone_number: string;
  email?: string;
  member_number?: string;
  reason: string;
  additional_notes?: string;
  supporting_document_1?: string;
  supporting_document_2?: string;
  status: 'PENDING' | 'STAGE_1' | 'STAGE_2' | 'STAGE_3' | 'APPROVED' | 'REJECTED';
  status_display?: string;
  current_stage: number;

  // Stage 1
  stage_1_reviewer?: number;
  stage_1_reviewer_name?: string;
  stage_1_reviewed_at?: string;
  stage_1_comments?: string;
  stage_1_status?: string;

  // Stage 2
  stage_2_reviewer?: number;
  stage_2_reviewer_name?: string;
  stage_2_reviewed_at?: string;
  stage_2_comments?: string;
  stage_2_status?: string;

  // Stage 3
  stage_3_reviewer?: number;
  stage_3_reviewer_name?: string;
  stage_3_reviewed_at?: string;
  stage_3_comments?: string;
  stage_3_status?: string;

  // Final
  final_decision?: 'APPROVED' | 'REJECTED';
  final_comments?: string;
  decided_at?: string;

  submitted_at: string;
  updated_at: string;
  user_name: string;
  created_at: string;
}

export interface ApplicationCreate {
  application_type: 'ENTRY' | 'EXIT';
  reason: string;
  additional_notes?: string;
  supporting_document_1?: File;
  supporting_document_2?: File;
}

export interface ApplicationReview {
  decision: 'APPROVE' | 'REJECT';
  comments?: string;
}

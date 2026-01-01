import { User } from "./user.model";

export interface ContributionType {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Contribution {
  id: number;
  member: number;
  member_details?: User;
  contribution_type: number;
  contribution_type_name?: string;
  amount: string;
  mpesa_transaction_code: string;
  mpesa_phone_number: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verified_by?: number;
  verified_by_name?: string;
  verified_at?: string;
  rejection_reason?: string;
  submitted_at: string;
  updated_at: string;
  notes?: string;
}

export interface ContributionCreate {
  contribution_type: number;
  amount: string;
  mpesa_transaction_code: string;
  mpesa_phone_number: string;
  notes?: string;
}

export interface ContributionVerification {
  status: 'VERIFIED' | 'REJECTED';
  rejection_reason?: string;
}

export interface Balance {
  contribution_type: string;
  total_balance: string;
  last_contribution_date?: string;
}

export interface DashboardStats {
  total_members: number;
  pending_contributions: number;
  contribution_summaries: ContributionSummary[];
}

export interface ContributionSummary {
  id: number;
  contribution_type: number;
  contribution_type_name: string;
  total_amount: string;
  total_contributions: number;
  active_members: number;
  last_updated: string;
}

// Chart data models
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface MonthlyContribution {
  month: string;
  amount: number;
  count: number;
}

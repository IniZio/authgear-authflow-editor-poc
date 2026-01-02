export type AuthflowType = 'signup' | 'login' | 'signup_login' | 'reauth' | 'account_recovery';

export interface AuthflowStep {
  _uuid?: string; // Internal unique ID
  id?: string;
  name?: string;
  type: string;
  one_of?: AuthflowBranch[];
  optional?: boolean;
  enrollment_allowed?: boolean;
  target_step?: string;
  // Specific properties based on type
  identification?: string;
  authentication?: string;
  user_profile?: UserProfileProperty[];
  enumerate_destinations?: boolean;
  allowed_channels?: AllowedChannel[];
}

export interface AuthflowBranch {
  identification?: string;
  authentication?: string;
  signup_flow?: string;
  login_flow?: string;
  steps?: AuthflowStep[];
  target_step?: string;
}

export interface UserProfileProperty {
  pointer: string;
  required?: boolean;
}

export interface AllowedChannel {
  channel: string;
  otp_form: string;
}

export interface Authflow {
  name: string;
  steps: AuthflowStep[];
}

export interface AuthflowConfig {
  signup_flows?: Authflow[];
  login_flows?: Authflow[];
  signup_login_flows?: Authflow[];
  reauth_flows?: Authflow[];
  account_recovery_flows?: Authflow[];
}

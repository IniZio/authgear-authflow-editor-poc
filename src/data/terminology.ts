export const FRIENDLY_STEP_NAMES: Record<string, string> = {
  identify: 'Identification',
  authenticate: 'Authentication',
  verify: 'Verification',
  user_profile: 'User Details',
  create_authenticator: 'Security Setup',
  select_destination: 'Delivery Choice',
  verify_account_recovery_code: 'Recovery Verify',
  reset_password: 'Password Reset',
  prompt_create_passkey: 'Passkey Offer',
  recovery_code: 'Recovery Codes',
  change_password: 'Update Password',
};

export const STEP_DESCRIPTIONS: Record<string, string> = {
  identify: 'Ask the user for their email, phone, or username.',
  authenticate: 'Verify the user with a password, OTP, or passkey.',
  verify: 'Ensure the user owns the email or phone provided.',
  user_profile: 'Collect additional information like name or birthdate.',
  create_authenticator: 'Enroll the user in a new security method.',
  select_destination: 'Let the user choose where to receive their login code.',
  target_step: 'A jump-back or redirection to a previous step.',
};

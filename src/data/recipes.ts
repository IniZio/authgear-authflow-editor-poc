import { AuthflowStep } from '../types/authflow';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  steps: AuthflowStep[];
}

export const RECIPES: Recipe[] = [
  {
    id: 'latte',
    name: 'Latte Flow',
    description: 'Signup with phone and then setup email + password.',
    steps: [
      {
        _uuid: 'latte-1',
        type: 'identify',
        name: 'setup_phone',
        one_of: [{ identification: 'phone' }]
      },
      {
        _uuid: 'latte-2',
        type: 'create_authenticator',
        name: 'create_sms_authenticator',
        target_step: 'setup_phone',
        one_of: [{ authentication: 'primary_oob_otp_sms' }]
      },
      {
        _uuid: 'latte-3',
        type: 'verify',
        name: 'verify_phone',
        target_step: 'setup_phone'
      },
      {
        _uuid: 'latte-4',
        type: 'identify',
        name: 'setup_email',
        one_of: [{ identification: 'email' }]
      },
      {
        _uuid: 'latte-5',
        type: 'create_authenticator',
        name: 'create_email_authenticator',
        target_step: 'setup_email',
        one_of: [{ authentication: 'primary_oob_otp_email' }]
      },
      {
        _uuid: 'latte-6',
        type: 'create_authenticator',
        name: 'setup_password',
        one_of: [{ authentication: 'primary_password' }]
      }
    ]
  },
  {
    id: 'google-style',
    name: 'Google Style',
    description: 'Classic Email -> Password -> 2FA (TOTP or SMS).',
    steps: [
      {
        _uuid: 'g1',
        type: 'identify',
        name: 'identify_user',
        one_of: [{ identification: 'email' }]
      },
      {
        _uuid: 'g2',
        type: 'authenticate',
        name: 'primary_auth',
        one_of: [{ authentication: 'primary_password' }]
      },
      {
        _uuid: 'g3',
        type: 'authenticate',
        name: 'secondary_auth',
        optional: true,
        one_of: [
          { authentication: 'secondary_totp' },
          { authentication: 'secondary_oob_otp_sms' }
        ]
      }
    ]
  },
  {
    id: 'passwordless',
    name: 'Modern Passwordless',
    description: 'OAuth and Passkey forward strategy.',
    steps: [
      {
        _uuid: 'p1',
        type: 'identify',
        name: 'select_identity',
        one_of: [
          { identification: 'oauth' },
          { identification: 'passkey' },
          { 
            identification: 'email',
            steps: [
              {
                _uuid: 'p2',
                type: 'authenticate',
                name: 'authenticate_email',
                one_of: [
                  { authentication: 'primary_passkey' },
                  { authentication: 'primary_oob_otp_email' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'uber-style',
    name: 'Uber Style',
    description: 'Dual-path identity: Phone or Email with interleaved verification.',
    steps: [
      {
        _uuid: 'u1',
        type: 'identify',
        name: 'setup_first_identity',
        one_of: [
          {
            identification: 'phone',
            steps: [
              { _uuid: 'u2', type: 'create_authenticator', target_step: 'setup_first_identity', one_of: [{ authentication: 'primary_oob_otp_sms' }] },
              { _uuid: 'u3', type: 'verify', target_step: 'setup_first_identity' },
              { _uuid: 'u4', type: 'identify', name: 'setup_second_identity', one_of: [{ identification: 'email' }] }
            ]
          },
          {
            identification: 'email',
            steps: [
              { _uuid: 'u5', type: 'create_authenticator', target_step: 'setup_first_identity', one_of: [{ authentication: 'primary_oob_otp_email' }] },
              { _uuid: 'u6', type: 'verify', target_step: 'setup_first_identity' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'account-recovery',
    name: 'Account Recovery',
    description: 'Standard password reset flow with email/SMS verification.',
    steps: [
      {
        _uuid: 'r1',
        type: 'identify',
        name: 'identify_account',
        one_of: [{ identification: 'email' }, { identification: 'phone' }]
      },
      {
        _uuid: 'r2',
        type: 'select_destination',
        name: 'choose_channel',
        enumerate_destinations: false,
        allowed_channels: [
          { channel: 'email', otp_form: 'link' },
          { channel: 'sms', otp_form: 'code' }
        ]
      },
      { _uuid: 'r3', type: 'verify_account_recovery_code', name: 'verify_code' },
      { _uuid: 'r4', type: 'reset_password', name: 'new_password' }
    ]
  },
  {
    id: 'reauth-full',
    name: 'Step-up Reauth',
    description: 'Require both primary and secondary factors for sensitive actions.',
    steps: [
      {
        _uuid: 're1',
        type: 'authenticate',
        name: 'primary_reauth',
        one_of: [{ authentication: 'primary_password' }]
      },
      {
        _uuid: 're2',
        type: 'authenticate',
        name: 'secondary_reauth',
        one_of: [{ authentication: 'secondary_totp' }, { authentication: 'secondary_oob_otp_sms' }]
      }
    ]
  },
  {
    id: 'omni-monster',
    name: 'The Omni-Channel Monster',
    description: 'The ultimate flexible flow: handles Social, Passkeys, Email, and Phone in one unified experience.',
    steps: [
      {
        _uuid: 'omni-1',
        type: 'identify',
        name: 'unified_identity',
        one_of: [
          { identification: 'oauth', steps: [{ _uuid: 'omni-2', type: 'user_profile', name: 'oauth_profile' }] },
          { identification: 'passkey' },
          { 
            identification: 'email',
            steps: [
              { _uuid: 'omni-3', type: 'authenticate', name: 'email_auth', one_of: [{ authentication: 'primary_password' }, { authentication: 'primary_passkey' }] },
              { _uuid: 'omni-4', type: 'authenticate', name: 'email_mfa', optional: true, one_of: [{ authentication: 'secondary_totp' }] }
            ]
          },
          {
            identification: 'phone',
            steps: [
              { _uuid: 'omni-5', type: 'authenticate', name: 'phone_auth', one_of: [{ authentication: 'primary_oob_otp_sms' }] }
            ]
          }
        ]
      },
      { _uuid: 'omni-6', type: 'prompt_create_passkey', name: 'suggest_passkey' }
    ]
  },
  {
    id: 'zero-trust-ent',
    name: 'Zero-Trust Enterprise',
    description: 'Extreme security: Forced MFA enrollment, Password + TOTP + Recovery Code backup.',
    steps: [
      {
        _uuid: 'zt-1',
        type: 'identify',
        name: 'identify_employee',
        one_of: [{ identification: 'username' }]
      },
      {
        _uuid: 'zt-2',
        type: 'authenticate',
        name: 'primary_auth',
        one_of: [{ authentication: 'primary_password' }]
      },
      {
        _uuid: 'zt-3',
        type: 'change_password',
        name: 'force_password_change',
        target_step: 'primary_auth'
      },
      {
        _uuid: 'zt-4',
        type: 'authenticate',
        name: 'mandatory_mfa',
        enrollment_allowed: true,
        one_of: [
          { authentication: 'secondary_totp' },
          { authentication: 'secondary_oob_otp_sms' },
          { authentication: 'recovery_code' }
        ]
      },
      { _uuid: 'zt-5', type: 'recovery_code', name: 'generate_backup_codes' }
    ]
  },
  {
    id: 'progressive-onboarding',
    name: 'Progressive Onboarding',
    description: 'Instant "Fast-Pass" social login followed by multi-step data enrichment.',
    steps: [
      {
        _uuid: 'po-1',
        type: 'identify',
        name: 'social_signup',
        one_of: [{ identification: 'oauth' }]
      },
      {
        _uuid: 'po-2',
        type: 'user_profile',
        name: 'collect_basic_info',
        user_profile: [{ pointer: '/given_name', required: true }, { pointer: '/family_name', required: true }]
      },
      {
        _uuid: 'po-3',
        type: 'user_profile',
        name: 'collect_marketing_data',
        user_profile: [{ pointer: '/x_age', required: true }, { pointer: '/x_interests', required: false }]
      },
      {
        _uuid: 'po-4',
        type: 'create_authenticator',
        name: 'enroll_mfa',
        one_of: [{ authentication: 'secondary_totp' }]
      }
    ]
  }
];

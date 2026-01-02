import React from 'react';
import { AuthflowStep } from '../types/authflow';
import { FRIENDLY_STEP_NAMES } from '../data/terminology';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StepFormProps {
  step: AuthflowStep;
  onChange: (updatedStep: AuthflowStep) => void;
}

const STEP_TYPES = [
  'identify', 'authenticate', 'verify', 'user_profile', 
  'recovery_code', 'change_password', 'select_destination', 
  'verify_account_recovery_code', 'reset_password', 'prompt_create_passkey'
];

const IDENTIFICATION_TYPES = ['email', 'phone', 'username', 'oauth', 'passkey'];

const AUTHENTICATION_TYPES = [
  'primary_password', 'primary_oob_otp_email', 'primary_oob_otp_sms',
  'secondary_password', 'secondary_totp', 'secondary_oob_otp_email',
  'secondary_oob_otp_sms', 'recovery_code', 'device_token', 'primary_passkey'
];

export const StepForm: React.FC<StepFormProps> = ({ step, onChange }) => {
  const handleChange = (name: string, value: any) => {
    onChange({ ...step, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="type">Step Type</Label>
        <Select
          value={step.type}
          onValueChange={(value) => handleChange('type', value)}
        >
          <SelectTrigger id="type" className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {STEP_TYPES.map(t => (
              <SelectItem key={t} value={t}>
                {FRIENDLY_STEP_NAMES[t] || t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Technical Name / ID</Label>
        <Input
          id="name"
          value={step.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. identify_user"
        />
      </div>

      {(step.type === 'identify') && (
        <div className="space-y-2">
          <Label htmlFor="identification">Identification Method</Label>
          <Select
            value={step.identification || 'none'}
            onValueChange={(value) => handleChange('identification', value === 'none' ? undefined : value)}
          >
            <SelectTrigger id="identification">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {IDENTIFICATION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      {(step.type === 'authenticate') && (
        <div className="space-y-2">
          <Label htmlFor="authentication">Authentication Method</Label>
          <Select
            value={step.authentication || 'none'}
            onValueChange={(value) => handleChange('authentication', value === 'none' ? undefined : value)}
          >
            <SelectTrigger id="authentication">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {AUTHENTICATION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="target_step">Jump to Step (target_step)</Label>
        <Input
          id="target_step"
          value={step.target_step || ''}
          onChange={(e) => handleChange('target_step', e.target.value)}
          placeholder="Name of step to jump to"
        />
      </div>

      <div className="flex items-center space-x-2 rounded-md border p-3">
        <Checkbox
          id="optional"
          checked={step.optional || false}
          onCheckedChange={(checked) => handleChange('optional', checked)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="optional"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Optional Step
          </Label>
          <p className="text-xs text-muted-foreground">
            Allow users to skip this step if no methods are available.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => (window as any).deleteStep(step._uuid)}
        >
          Delete Step
        </Button>
      </div>
    </div>
  );
};

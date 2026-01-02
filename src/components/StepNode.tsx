import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AuthflowStep } from '../types/authflow';
import { 
  Settings, 
  ShieldCheck, 
  UserCircle, 
  KeyRound, 
  Terminal, 
  Mail, 
  Phone, 
  Fingerprint,
  ExternalLink
} from 'lucide-react';
import { FRIENDLY_STEP_NAMES } from '../data/terminology';
import { Badge } from "@/components/ui/badge"

const StepNode = ({ data, selected }: NodeProps<{ step: AuthflowStep }>) => {
  const { step } = data;
  
  const friendlyName = FRIENDLY_STEP_NAMES[step.type] || step.type.replace(/_/g, ' ');
  
  const getIcon = () => {
    switch (step.type) {
      case 'identify': return <UserCircle className="w-4 h-4 text-blue-500" />;
      case 'authenticate': return <KeyRound className="w-4 h-4 text-emerald-500" />;
      case 'verify': return <ShieldCheck className="w-4 h-4 text-amber-500" />;
      case 'user_profile': return <Settings className="w-4 h-4 text-purple-500" />;
      case 'create_authenticator': return <KeyRound className="w-4 h-4 text-pink-500" />;
      default: return <Terminal className="w-4 h-4 text-slate-500" />;
    }
  };

  const getSemanticLabel = () => {
    if (step.identification) {
      if (step.identification === 'email') return <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</div>;
      if (step.identification === 'phone') return <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone</div>;
      if (step.identification === 'passkey') return <div className="flex items-center gap-1.5"><Fingerprint className="w-3 h-3" /> Passkey</div>;
      if (step.identification === 'oauth') return <div className="flex items-center gap-1.5"><ExternalLink className="w-3 h-3" /> Social</div>;
    }
    if (step.authentication) {
      if (step.authentication.includes('password')) return 'Password';
      if (step.authentication.includes('otp')) return 'OTP Code';
      if (step.authentication.includes('totp')) return 'TOTP (2FA)';
    }
    return null;
  };

  return (
    <div className={`min-w-[180px] p-0 shadow-xl rounded-xl bg-card border-2 transition-all duration-200 ${selected ? 'border-primary ring-4 ring-primary/10' : 'border-border'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-muted-foreground border-2 border-background shadow-sm" />
      
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-lg p-2 bg-muted/50 border border-border shadow-sm">
            {getIcon()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em] truncate">{friendlyName}</span>
            <span className="text-[13px] font-bold text-foreground leading-none truncate max-w-[120px]">{step.name || step.id || step.type}</span>
          </div>
        </div>

        {getSemanticLabel() && (
          <Badge variant="secondary" className="w-full justify-center py-1 text-[10px] font-bold uppercase tracking-wider bg-accent/50 hover:bg-accent/50 text-accent-foreground border-accent/20">
            {getSemanticLabel()}
          </Badge>
        )}

        {step.optional && (
          <div className="mt-2 text-[9px] font-bold text-amber-600 uppercase tracking-widest text-center px-2 py-0.5 bg-amber-50 rounded-full border border-amber-100">
            Optional
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-muted-foreground border-2 border-background shadow-sm" />
    </div>
  );
};

export default memo(StepNode);

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface Lead {
  firstName: string;
  lastName: string;
  phone: string;
  fullName: string;
  niche: string;
  role: string;
  instagram: string;
  leadId: string;
}

interface FunnelContextValue {
  lead: Lead;
  updateLead: (patch: Partial<Lead>) => void;
  step1Submitted: boolean;
  markStep1Submitted: () => void;
}

const EMPTY_LEAD: Lead = {
  firstName: '',
  lastName: '',
  phone: '',
  fullName: '',
  niche: '',
  role: '',
  instagram: '',
  leadId: '',
};

const STORAGE_KEY = 'ai-funnel-lead';

function loadLead(): Lead {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY_LEAD, ...JSON.parse(raw) };
  } catch {
    /* хранилище недоступно */
  }
  return EMPTY_LEAD;
}

const FunnelContext = createContext<FunnelContextValue | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [lead, setLead] = useState<Lead>(loadLead);
  const [step1Submitted, setStep1Submitted] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
    } catch {
      /* хранилище недоступно */
    }
  }, [lead]);

  const updateLead = (patch: Partial<Lead>) =>
    setLead((prev) => ({ ...prev, ...patch }));

  const markStep1Submitted = () => {
    setStep1Submitted(true);
    setLead((prev) => ({ ...prev, fullName: `${prev.firstName} ${prev.lastName}`.trim() }));
  };

  return (
    <FunnelContext.Provider value={{ lead, updateLead, step1Submitted, markStep1Submitted }}>
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel() {
  const ctx = useContext(FunnelContext);
  if (!ctx) throw new Error('useFunnel must be used inside FunnelProvider');
  return ctx;
}

import { useEffect, useState } from 'react';

import { http } from '@mpt-extension/sdk';

import { AgreementSyncResult, ApiResponse } from '../model';

export type AgreementLoadState = 'loading' | 'error' | 'ready';

interface AgreementResult {
  agreement: AgreementSyncResult | null;
  status: AgreementLoadState;
}

export function useAgreement(agreementId: string): AgreementResult {
  const [status, setStatus] = useState<AgreementLoadState>('loading');
  const [agreement, setAgreement] = useState<AgreementSyncResult | null>(null);

  useEffect(() => {
    if (!agreementId) {
      setAgreement(null);
      setStatus('error');
      return undefined;
    }

    setStatus('loading');
    setAgreement(null);
    let active = true;

    const load = async () => {
      try {
        const encodedAgreementId = encodeURIComponent(agreementId);
        const response = await http.get<ApiResponse<AgreementSyncResult>>(
          `/api/v2/agreements/${encodedAgreementId}`,
        );
        if (!active) {
          return;
        }
        setAgreement(response.data.data);
        setStatus('ready');
      } catch {
        if (active) {
          setStatus('error');
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [agreementId]);

  return { agreement, status };
}

import { useMPTModal } from '@mpt-extension/sdk-react';
import { Button } from '@softwareone-platform/sdk-react-ui-v0/button';

import { useAgreement } from '../../shared/hooks/useAgreement';
import { useAgreementId } from '../../shared/hooks/useAgreementId';
import { AgreementDetailsList } from '../../shared/components/AgreementDetailsList';
import '../../shared/components/AgreementActionModal.scss';

export default function App() {
  const agreementId = useAgreementId();
  const { agreement, status } = useAgreement(agreementId);
  const { close } = useMPTModal();

  return (
    <div className="agreement-action-modal">
      <div className="agreement-action-modal__content">
        <AgreementDetailsList agreement={agreement} status={status} />
      </div>
      <div className="agreement-action-modal__actions">
        <Button color="primary" type="solid" onClick={() => close()}>
          Close
        </Button>
      </div>
    </div>
  );
}

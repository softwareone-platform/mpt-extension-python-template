import { useMPTContext, useMPTModal } from '@mpt-extension/sdk-react';
import { Button } from '@softwareone-platform/sdk-react-ui-v0/button';
import { RegularText } from '@softwareone-platform/sdk-react-ui-v0/text';

import '../../shared/components/ActionModal.scss';

interface DialogContext {
  question?: string;
}

export default function App() {
  const context = useMPTContext<DialogContext>();
  const { close } = useMPTModal();

  return (
    <div className="action-modal">
      <div className="action-modal__content">
        <RegularText as="p" size={2}>
          {context?.question ?? 'This dialog was opened by id via useMPTModal().open().'}
        </RegularText>
      </div>
      <div className="action-modal__actions">
        <Button type="outline" onClick={() => close({ confirmed: false })}>
          Cancel
        </Button>
        <Button color="primary" type="solid" onClick={() => close({ confirmed: true })}>
          Confirm
        </Button>
      </div>
    </div>
  );
}

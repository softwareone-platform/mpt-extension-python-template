import { useState } from 'react';

import { useMPTModal } from '@mpt-extension/sdk-react';
import { Button } from '@softwareone-platform/sdk-react-ui-v0/button';

import { ShowCode } from './elements/ShowCode';

const codeBackend = `
# Modal plugs are registered without a socket: they never render as a page
# action and exist only to be opened by id.

from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import ModalPlug

modals_router = PlugRouter()


@modals_router.register()
def modal_plugs() -> list[ModalPlug]:
    return [
        ModalPlug(
            id="dialog",
            name="Extension example dialog",
            href="/static/dialog/index.js",
        ),
    ]
`;

const codeFrontend = `
import { useMPTModal } from '@mpt-extension/sdk-react';

function OpenDialogButton() {
  const { open } = useMPTModal();

  const openDialog = () =>
    open('dialog', {
      // Arbitrary payload the modal reads via useMPTContext().
      context: { question: 'Proceed with the example action?' },
      // Whatever the modal passes to close(data) comes back here.
      onClose: (result) => console.log('dialog returned', result),
    });

  return <button onClick={openDialog}>Open dialog</button>;
}
`;

function ResultOutput({ label, result }: { label: string; result: unknown }) {
  return (
    <p>
      {label}:{' '}
      <code data-testid={`${label} result`}>
        {result === undefined ? 'not opened yet' : JSON.stringify(result)}
      </code>
    </p>
  );
}

export function Modals() {
  const { open } = useMPTModal();
  const [dialogResult, setDialogResult] = useState<unknown>(undefined);
  const [wizardResult, setWizardResult] = useState<unknown>(undefined);

  return (
    <>
      <h2>Modals opened by id</h2>
      <p>
        Plugs registered as <code>ModalPlug</code> declare no socket, so the platform never renders
        them as a page action. They exist only to be opened programmatically with{' '}
        <code>useMPTModal().open(&apos;&lt;plug-id&gt;&apos;)</code> — for confirmation dialogs,
        multi-step wizards, and other ad-hoc modals. The opener can pass a <code>context</code>{' '}
        payload to the modal, and the modal reports a result back through <code>close(data)</code>,
        delivered to the opener&apos;s <code>onClose</code> callback.
      </p>

      <h3>Dialog round-trip</h3>
      <p>
        Opens the socketless <code>dialog</code> plug with a question in the context and shows the
        confirmation result it returns.
      </p>
      <Button
        color="primary"
        type="solid"
        onClick={() =>
          open('dialog', {
            context: { question: 'Proceed with the example action?' },
            onClose: setDialogResult,
          })
        }
      >
        Open dialog
      </Button>
      <ResultOutput label="Dialog" result={dialogResult} />

      <h3>Wizard round-trip</h3>
      <p>
        Opens the socketless <code>wizard</code> plug, which echoes the received context and reports
        whether it was completed or dismissed.
      </p>
      <Button
        color="primary"
        type="solid"
        onClick={() =>
          open('wizard', {
            context: { topic: 'modal round-trip' },
            onClose: setWizardResult,
          })
        }
      >
        Open wizard
      </Button>
      <ResultOutput label="Wizard" result={wizardResult} />

      <h3>Backend registration</h3>
      <ShowCode>{codeBackend}</ShowCode>

      <h3>Opening from the frontend</h3>
      <ShowCode>{codeFrontend}</ShowCode>
    </>
  );
}

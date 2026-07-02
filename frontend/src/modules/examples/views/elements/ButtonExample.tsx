import { useState } from 'react';

import { Button } from '@softwareone-platform/sdk-react-ui-v0/button';

import { ShowCode } from './ShowCode';

import './ButtonExample.scss';

const code = `
<Button type="primary" onClick={() => setLastClicked('Save')}>Save</Button>
<Button type="secondary" onClick={() => setLastClicked('Cancel')}>Cancel</Button>
<Button type="outline" onClick={() => setLastClicked('Edit')}>Edit</Button>
<Button type="text" onClick={() => setLastClicked('More info')}>More info</Button>
<Button type="primary" color="danger" onClick={() => setLastClicked('Delete')}>Delete</Button>
<Button type="primary" isBusy>Saving…</Button>
<Button isDisabled>Disabled</Button>
`;

export function ButtonExample() {
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  return (
    <>
      <h2>Buttons</h2>
      <p>
        Use the <code>type</code> prop to pick a visual variant (<code>primary</code>,{' '}
        <code>secondary</code>, <code>outline</code>, <code>text</code>) and <code>color</code> for
        intent (<code>primary</code>, <code>danger</code>, <code>dark</code>). Toggle{' '}
        <code>isBusy</code> for loading state.
      </p>
      <div className="button-row">
        <Button type="primary" onClick={() => setLastClicked('Save')}>
          Save
        </Button>
        <Button type="secondary" onClick={() => setLastClicked('Cancel')}>
          Cancel
        </Button>
        <Button type="outline" onClick={() => setLastClicked('Edit')}>
          Edit
        </Button>
        <Button type="text" onClick={() => setLastClicked('More info')}>
          More info
        </Button>
        <Button type="primary" color="danger" onClick={() => setLastClicked('Delete')}>
          Delete
        </Button>
        <Button type="primary" isBusy>
          Saving…
        </Button>
        <Button isDisabled>Disabled</Button>
      </div>
      <p>
        Last clicked: <code>{lastClicked ?? '—'}</code>
      </p>
      <ShowCode>{code}</ShowCode>
    </>
  );
}

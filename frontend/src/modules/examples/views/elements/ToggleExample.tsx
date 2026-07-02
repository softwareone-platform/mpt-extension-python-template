import { useState } from 'react';

import { Toggle } from '@softwareone-platform/sdk-react-ui-v0/toggle';

import { ShowCode } from './ShowCode';

const code = `
const [isEnabled, setIsEnabled] = useState(true);

<Toggle
  label="Enable notifications"
  isChecked={isEnabled}
  onChange={setIsEnabled}
/>
`;

export function ToggleExample() {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <>
      <h3>Toggle</h3>
      <Toggle label="Enable notifications" isChecked={isEnabled} onChange={setIsEnabled} />
      <p>
        Current value: <code>{String(isEnabled)}</code>
      </p>
      <ShowCode>{code}</ShowCode>
    </>
  );
}

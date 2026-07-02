import { useState } from 'react';

import { Checkbox } from '@softwareone-platform/sdk-react-ui-v0/checkbox';

import { ShowCode } from './ShowCode';

const code = `
const [isSubscribed, setIsSubscribed] = useState(false);

<Checkbox
  id="subscribe"
  label="Subscribe to product updates"
  isChecked={isSubscribed}
  onChange={(e) => setIsSubscribed(e.target.checked)}
/>
`;

export function CheckboxExample() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <>
      <h3>Checkbox</h3>
      <Checkbox
        id="subscribe"
        label="Subscribe to product updates"
        isChecked={isSubscribed}
        onChange={(e) => setIsSubscribed(e.target.checked)}
      />
      <p>
        Current value: <code>{String(isSubscribed)}</code>
      </p>
      <ShowCode>{code}</ShowCode>
    </>
  );
}

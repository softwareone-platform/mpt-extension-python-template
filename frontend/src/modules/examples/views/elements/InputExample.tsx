import { useState } from 'react';

import { Input } from '@softwareone-platform/sdk-react-ui-v0/input';

import { ShowCode } from './ShowCode';

const code = `
const [value, setValue] = useState('');

<Input
  name="fullName"
  label="Full name"
  placeholder="Jane Doe"
  value={value}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
  description="Shown on your profile page"
/>
`;

export function InputExample() {
  const [value, setValue] = useState('');

  return (
    <>
      <h3>Text input</h3>
      <Input
        name="fullName"
        label="Full name"
        placeholder="Jane Doe"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        description="Shown on your profile page"
      />
      <p>
        Current value: <code>{value || '—'}</code>
      </p>
      <ShowCode>{code}</ShowCode>
    </>
  );
}

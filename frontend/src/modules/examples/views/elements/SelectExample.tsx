import { useState } from 'react';

import { Select, SelectItem } from '@softwareone-platform/sdk-react-ui-v0/select';

import { ShowCode } from './ShowCode';

const roleOptions: SelectItem[] = [
  { label: 'Administrator', value: 'admin' },
  { label: 'Developer', value: 'developer' },
  { label: 'Viewer', value: 'viewer' },
];

const code = `
const roleOptions: SelectItem[] = [
  { label: 'Administrator', value: 'admin' },
  { label: 'Developer', value: 'developer' },
  { label: 'Viewer', value: 'viewer' },
];

const [role, setRole] = useState<string>('developer');

<Select
  options={roleOptions}
  value={role}
  onChange={setRole}
  controlLabel="Role"
  placeholder="Pick a role"
/>
`;

export function SelectExample() {
  const [role, setRole] = useState<string>('developer');

  return (
    <>
      <h3>Select</h3>
      <Select
        options={roleOptions}
        value={role}
        onChange={setRole}
        controlLabel="Role"
        placeholder="Pick a role"
      />
      <p>
        Current value: <code>{role}</code>
      </p>
      <ShowCode>{code}</ShowCode>
    </>
  );
}

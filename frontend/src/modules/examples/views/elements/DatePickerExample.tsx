import { useState } from 'react';

import { DatePicker } from '@softwareone-platform/sdk-react-ui-v0/date-picker';

import { ShowCode } from './ShowCode';

const code = `
const [date, setDate] = useState<string>('2026-04-13');

<DatePicker
  label="Start date"
  value={date}
  onChange={(value) => setDate(value as string)}
  dateFormat="yyyy-MM-dd"
  placeholder="yyyy-MM-dd"
/>
`;

export function DatePickerExample() {
  const [date, setDate] = useState<string>('2026-04-13');

  return (
    <>
      <h3>Date picker</h3>
      <DatePicker
        label="Start date"
        value={date}
        onChange={(value) => setDate(value as string)}
        dateFormat="yyyy-MM-dd"
        placeholder="yyyy-MM-dd"
      />
      <p>
        Current value: <code>{date}</code>
      </p>
      <ShowCode>{code}</ShowCode>
    </>
  );
}

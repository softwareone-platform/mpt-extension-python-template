import { Divider } from '@softwareone-platform/sdk-react-ui-v0/divider';

import { ButtonExample } from './elements/ButtonExample';
import { CheckboxExample } from './elements/CheckboxExample';
import { DatePickerExample } from './elements/DatePickerExample';
import { EntityReferenceExample } from './elements/EntityReferenceExample';
import { GridExample } from './elements/GridExample';
import { InputExample } from './elements/InputExample';
import { SelectExample } from './elements/SelectExample';
import { ToggleExample } from './elements/ToggleExample';

import './Elements.scss';

export function Elements() {
  return (
    <>
      <div className="elements-narrow">
        <h2>Basic UI elements</h2>
        <p>
          Below are a few key examples of the basic UI elements you will most often reach for when
          building an extension.
        </p>
        <Divider />
        <ButtonExample />
        <Divider />
        <h2>Form elements</h2>
        <p>
          Form controls follow a predictable pattern: a controlled <code>value</code> plus an{' '}
          <code>onChange</code> callback. Labels, descriptions, and error messages are rendered by the
          component itself — you rarely need to wrap them in your own layout.
        </p>
        <Divider />
        <InputExample />
        <Divider />
        <SelectExample />
        <Divider />
        <CheckboxExample />
        <Divider />
        <ToggleExample />
        <Divider />
        <DatePickerExample />
        <Divider />
        <EntityReferenceExample />
      </div>
      <Divider />
      <GridExample />
    </>
  );
}

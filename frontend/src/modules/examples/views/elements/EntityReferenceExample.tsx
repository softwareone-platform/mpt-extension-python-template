import { Avatar } from '@softwareone-platform/sdk-react-ui-v0/avatar';
import { EntityReference } from '@softwareone-platform/sdk-react-ui-v0/entity-reference';

import { ShowCode } from './ShowCode';

const code = `
<EntityReference
  icon={<Avatar size={40} shape="circle" type="text" text="Ada Lovelace" bgColor="var(--brand-primary)"/>}
  primaryContent="Ada Lovelace"
  secondaryContent="USR-1234-5678"
  chipLabel="Active"
  chipColor="success"
  isPrimaryContentBold
/>
`;

export function EntityReferenceExample() {
  return (
    <>
      <h2>Entity reference</h2>
      <p>
        <code>EntityReference</code> is the canonical way to render a reference to a platform entity —
        a user, an account, a product — with an avatar, a primary label, a secondary identifier, and
        optionally a status chip. Use it in lists, grid cells, and detail headers to stay consistent
        with the rest of the platform.
      </p>
      <EntityReference
        icon={<Avatar size={40} shape="circle" type="text" text="Ada Lovelace" bgColor="var(--brand-primary)" />}
        primaryContent="Ada Lovelace"
        secondaryContent="USR-1234-5678"
        chipLabel="Active"
        chipColor="success"
        isPrimaryContentBold
      />
      <ShowCode>{code}</ShowCode>
    </>
  );
}

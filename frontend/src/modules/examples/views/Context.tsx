import { useMPTContext } from '@mpt-extension/sdk-react';

import { ShowCode } from './elements/ShowCode';

const codeBasic = `
import { useMPTContext } from '@mpt-extension/sdk-react';

// The shape of the context depends on where your Plug is rendered.
// auth is always present; data carries socket-specific objects.

interface MPTContext {
  auth: {
    user:    { id: string };
    account: { id: string; type: string };
  };
  data: object; // <-- depends on the socket (see below)
}

function MyComponent() {
  const ctx = useMPTContext<MPTContext>();

  // auth is always available
  const userId    = ctx.auth.user.id;
  const accountId = ctx.auth.account.id;

  // The contents of data depend on the socket where your Plug is rendered.
  // For example, a Plug on a subscription detail page receives the
  // subscription object; on an order page it would be the order, and so on.
  // Top-level pages have no entity in scope, so data is empty.
  const subscription = ctx.data.subscription;

  return <p>Subscription {subscription.id} — {subscription.status}</p>;
}
`;

const codeReactive = `
// The context updates automatically when the platform pushes changes.
// Your component re-renders with fresh data — no polling required.

function OrderSidebar() {
  const { auth, data } = useMPTContext();
  const order = data.order; // available on portal.commerce.orders.order

  return (
    <div>
      <p>Order: {order.id}</p>
      <p>Status: {order.status}</p>
      <p>Viewed by: {auth.user.id}</p>
    </div>
  );
}
`;

export function Context() {
  const ctx = useMPTContext();

  return (
    <>
      <h2>Platform context</h2>
      <p>
        Every Plug receives context from the platform via <code>useMPTContext()</code>. The context
        always contains <code>auth</code> with the current user and account. The <code>data</code>{' '}
        field carries objects relevant to the socket where the Plug is rendered — for example, the
        current order, subscription, or agreement.
      </p>
      <p>
        This Plug is mounted at a top-level socket (<code>portal</code>), so <code>data</code> is
        empty here. When your Plug targets a detail page like{' '}
        <code>portal.commerce.orders.order</code>, the platform will populate <code>data</code> with
        the entity in scope.
      </p>

      <h3>Live context</h3>
      <p>This is the actual context object received by this page right now:</p>
      <pre>
        <code>{JSON.stringify(ctx, null, 2)}</code>
      </pre>

      <h3>Usage</h3>
      <ShowCode>{codeBasic}</ShowCode>

      <h3>Reactive updates</h3>
      <p>
        The context updates automatically when the platform pushes changes — your component re-renders
        with fresh data, no polling needed.
      </p>
      <ShowCode>{codeReactive}</ShowCode>
    </>
  );
}

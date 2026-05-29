// Shared factories + fixture for `agreements-line-actions` and
// `agreements-agreement-actions` App tests. Names are prefixed with `mock` so
// babel-plugin-jest-hoist allows referencing them from `jest.mock(...)` calls
// (which get hoisted above imports).

export const agreementPayload = {
  assets: 3,
  buyer: { id: 'BUY-1', name: 'Acme Buyer' },
  client: { id: 'ACC-1', name: 'Acme Client' },
  currency: 'USD',
  id: 'AGR-1234-5678-9012',
  lines: 2,
  name: 'Adobe VIP Marketplace',
  order: { id: 'ORD-1234', name: 'Adobe VIP Order' },
  product: { id: 'PRD-1', name: 'Adobe' },
  seller: { id: 'SEL-1', name: 'SoftwareOne' },
  status: 'Active',
  subscriptions: 1,
};

export const mockMptSdkFactory = () => ({
  http: { get: jest.fn() },
});

export const mockMptSdkReactFactory = () => ({
  useMPTContext: jest.fn(),
  useMPTModal: jest.fn(),
});

export const mockButtonFactory = () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Button: ({ children, onClick }: { children?: import('react').ReactNode; onClick?: () => void }) =>
      React.createElement('button', { onClick }, children),
  };
};

export const mockTextFactory = () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const renderText = ({ as = 'span', children }: { as?: string; children?: import('react').ReactNode }) =>
    React.createElement(as, null, children);
  return {
    BoldText: renderText,
    RegularText: renderText,
  };
};

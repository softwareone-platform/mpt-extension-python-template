import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { AddPlugShowcase } from './AddPlugShowcase';

jest.mock(
  '@mpt-extension/sdk-react',
  () => ({
    useMPTContext: jest.fn(() => ({})),
    useMPTModal: jest.fn(() => ({ close: jest.fn(), open: jest.fn() })),
  }),
  { virtual: true },
);

jest.mock('@softwareone-platform/sdk-react-ui-v0/button', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Button: ({ children }: { children?: import('react').ReactNode }) =>
      React.createElement('button', null, children),
  };
});

jest.mock('@softwareone-platform/sdk-react-ui-v0/card', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Card: ({ children }: { children?: import('react').ReactNode }) =>
      React.createElement('div', { 'data-testid': 'card' }, children),
  };
});

jest.mock('@softwareone-platform/sdk-react-ui-v0/divider', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return { Divider: () => React.createElement('hr', null) };
});

jest.mock('@softwareone-platform/sdk-react-ui-v0/input', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Input: ({ label }: { label?: string }) =>
      React.createElement('input', { type: 'text', 'aria-label': label, readOnly: true }),
  };
});

jest.mock('@softwareone-platform/sdk-react-ui-v0/switcher', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return { Switcher: () => React.createElement('div', null) };
});

describe('AddPlugShowcase', () => {
  it('renders a modal dialog header on an .actions socket', () => {
    render(<AddPlugShowcase socket="portal.commerce.orders.order.actions" />);

    expect(
      screen.getByText('Add a Plug to portal.commerce.orders.order.actions'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders an optional icon field', () => {
    render(<AddPlugShowcase socket="portal" />);

    expect(screen.getByRole('textbox', { name: 'Icon' })).toBeInTheDocument();
  });

  it('renders inside a card on the top-level portal socket', () => {
    render(<AddPlugShowcase socket="portal" />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.queryByText(/Add a Plug to/)).not.toBeInTheDocument();
  });
});

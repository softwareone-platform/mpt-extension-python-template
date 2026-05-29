import {
  agreementPayload,
  mockMptSdkFactory,
  mockMptSdkReactFactory,
  mockTextFactory,
} from '../../shared/test-utils/agreement-mocks';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { http } from '@mpt-extension/sdk';
import { useMPTContext, useMPTModal } from '@mpt-extension/sdk-react';

import App from './App';

jest.mock('@mpt-extension/sdk', () => mockMptSdkFactory(), { virtual: true });
jest.mock('@mpt-extension/sdk-react', () => mockMptSdkReactFactory(), { virtual: true });
jest.mock('@softwareone-platform/sdk-react-ui-v0/text', () => mockTextFactory());

jest.mock('@softwareone-platform/sdk-react-ui-v0/wizard', () => {
  const React = jest.requireActual<typeof import('react')>('react');

  const Content = ({ children }: { children?: import('react').ReactNode }) =>
    React.createElement('div', null, children);
  Content.Steps = () => null;
  Content.StepContent = ({
    children,
  }: {
    children: (props: { activeStepIndex: number }) => import('react').ReactNode;
  }) =>
    React.createElement(
      React.Fragment,
      null,
      children({ activeStepIndex: 0 }),
      children({ activeStepIndex: 1 }),
    );

  const Wizard = ({ children, onClose }: { children?: import('react').ReactNode; onClose?: () => void }) =>
    React.createElement(
      'div',
      null,
      children,
      React.createElement('button', { onClick: onClose }, 'Close'),
    );
  Wizard.Header = ({ children }: { children?: import('react').ReactNode }) =>
    React.createElement('div', null, children);
  Wizard.Content = Content;
  Wizard.Actions = () => null;

  return { Wizard };
});

const mockGet = jest.mocked(http.get);
const mockUseMPTContext = jest.mocked(useMPTContext);
const mockUseMPTModal = jest.mocked(useMPTModal);
const close = jest.fn();

describe('agreement action wizard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMPTModal.mockReturnValue({ open: jest.fn(), close });
  });

  it('shows the intro step and loads the agreement details step', async () => {
    mockUseMPTContext.mockReturnValue({ data: { agreement: { id: 'AGR-1234-5678-9012' } } });
    mockGet.mockResolvedValue({ data: { data: agreementPayload } });

    render(<App />);

    expect(screen.getByText(/This is an example wizard/)).toBeInTheDocument();
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/api/v2/agreements/AGR-1234-5678-9012');
    });
    expect(await screen.findByText('Adobe VIP Order (ORD-1234)')).toBeInTheDocument();
    expect(screen.getByText('Acme Buyer (BUY-1)')).toBeInTheDocument();
    expect(screen.getByText('SoftwareOne (SEL-1)')).toBeInTheDocument();
  });

  it('shows an error in the details step when the agreement context is missing', () => {
    mockUseMPTContext.mockReturnValue({});

    render(<App />);

    expect(screen.getByText('Agreement details could not be loaded.')).toBeInTheDocument();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('closes the wizard', () => {
    mockUseMPTContext.mockReturnValue({});

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(close).toHaveBeenCalled();
  });
});

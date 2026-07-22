import { mockMptSdkReactFactory, mockTextFactory } from '../../shared/test-utils/modal-mocks';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useMPTContext, useMPTModal } from '@mpt-extension/sdk-react';

import App from './App';

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

  const Wizard = ({
    children,
    onClose,
    onSave,
  }: {
    children?: import('react').ReactNode;
    onClose?: () => void;
    onSave?: () => void;
  }) =>
    React.createElement(
      'div',
      null,
      children,
      React.createElement('button', { onClick: onClose }, 'Close'),
      React.createElement('button', { onClick: onSave }, 'Done'),
    );
  Wizard.Header = ({ children }: { children?: import('react').ReactNode }) =>
    React.createElement('div', null, children);
  Wizard.Content = Content;
  Wizard.Actions = () => null;

  return { Wizard };
});

const mockUseMPTContext = jest.mocked(useMPTContext);
const mockUseMPTModal = jest.mocked(useMPTModal);
const close = jest.fn();

describe('socketless wizard plug', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMPTModal.mockReturnValue({ open: jest.fn(), close });
  });

  it('shows the intro step', () => {
    mockUseMPTContext.mockReturnValue({});

    render(<App />);

    expect(screen.getByText(/This wizard has no socket/)).toBeInTheDocument();
  });

  it('echoes the opener context in the context step', () => {
    mockUseMPTContext.mockReturnValue({ topic: 'modal round-trip' });

    render(<App />);

    expect(screen.getByText(/"topic": "modal round-trip"/)).toBeInTheDocument();
  });

  it('returns an incomplete result when the wizard is closed', () => {
    mockUseMPTContext.mockReturnValue({});

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(close).toHaveBeenCalledWith({ completed: false });
  });

  it('returns a completed result when the wizard finishes', () => {
    mockUseMPTContext.mockReturnValue({});

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(close).toHaveBeenCalledWith({ completed: true });
  });
});

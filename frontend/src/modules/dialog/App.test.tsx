import {
  mockButtonFactory,
  mockMptSdkReactFactory,
  mockTextFactory,
} from '../../shared/test-utils/modal-mocks';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useMPTContext, useMPTModal } from '@mpt-extension/sdk-react';

import App from './App';

jest.mock('@mpt-extension/sdk-react', () => mockMptSdkReactFactory(), { virtual: true });
jest.mock('@softwareone-platform/sdk-react-ui-v0/button', () => mockButtonFactory());
jest.mock('@softwareone-platform/sdk-react-ui-v0/text', () => mockTextFactory());

const mockUseMPTContext = jest.mocked(useMPTContext);
const mockUseMPTModal = jest.mocked(useMPTModal);
const close = jest.fn();

describe('socketless dialog plug', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMPTModal.mockReturnValue({ open: jest.fn(), close });
  });

  it('renders the question passed by the opener', () => {
    mockUseMPTContext.mockReturnValue({ question: 'Sync this agreement now?' });

    render(<App />);

    expect(screen.getByText('Sync this agreement now?')).toBeInTheDocument();
  });

  it('renders a fallback message when the opener sends no question', () => {
    mockUseMPTContext.mockReturnValue({});

    render(<App />);

    expect(
      screen.getByText('This dialog was opened by id via useMPTModal().open().'),
    ).toBeInTheDocument();
  });

  it('returns a confirmed result on Confirm click', () => {
    mockUseMPTContext.mockReturnValue({});

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(close).toHaveBeenCalledWith({ confirmed: true });
  });

  it('returns an unconfirmed result on Cancel click', () => {
    mockUseMPTContext.mockReturnValue({});

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(close).toHaveBeenCalledWith({ confirmed: false });
  });
});

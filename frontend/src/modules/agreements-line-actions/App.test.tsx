import {
  agreementPayload,
  mockButtonFactory,
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
jest.mock('@softwareone-platform/sdk-react-ui-v0/button', () => mockButtonFactory());
jest.mock('@softwareone-platform/sdk-react-ui-v0/text', () => mockTextFactory());

const mockGet = jest.mocked(http.get);
const mockUseMPTContext = jest.mocked(useMPTContext);
const mockUseMPTModal = jest.mocked(useMPTModal);
const close = jest.fn();

describe('agreement action info modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMPTModal.mockReturnValue({ open: jest.fn(), close });
  });

  it('loads and renders the highlights panel with agreement details', async () => {
    mockUseMPTContext.mockReturnValue({ data: { agreement: { id: 'AGR-1234-5678-9012' } } });
    mockGet.mockResolvedValue({ data: { data: agreementPayload } });

    render(<App />);

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/api/v2/agreements/AGR-1234-5678-9012');
    });
    expect(await screen.findByText('Adobe VIP Order (ORD-1234)')).toBeInTheDocument();
    expect(screen.getByText('Acme Buyer (BUY-1)')).toBeInTheDocument();
    expect(screen.getByText('SoftwareOne (SEL-1)')).toBeInTheDocument();
  });

  it('shows an error message when the agreement context is missing', () => {
    mockUseMPTContext.mockReturnValue({});

    render(<App />);

    expect(screen.getByText('Agreement details could not be loaded.')).toBeInTheDocument();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('closes the modal on Close button click', () => {
    mockUseMPTContext.mockReturnValue({});

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(close).toHaveBeenCalled();
  });
});

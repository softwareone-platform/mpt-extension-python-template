import { mockButtonFactory, mockMptSdkReactFactory } from '../../../shared/test-utils/modal-mocks';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useMPTModal } from '@mpt-extension/sdk-react';

import { Modals } from './Modals';

jest.mock('@mpt-extension/sdk-react', () => mockMptSdkReactFactory(), { virtual: true });
jest.mock('@softwareone-platform/sdk-react-ui-v0/button', () => mockButtonFactory());

const mockUseMPTModal = jest.mocked(useMPTModal);
const open = jest.fn();

describe('examples modals view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMPTModal.mockReturnValue({ open, close: jest.fn() });
  });

  it('opens the dialog plug by id with a context payload', () => {
    render(<Modals />);

    fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }));

    expect(open).toHaveBeenCalledWith('dialog', {
      context: { question: 'Proceed with the example action?' },
      onClose: expect.any(Function),
    });
  });

  it('opens the wizard plug by id with a context payload', () => {
    render(<Modals />);

    fireEvent.click(screen.getByRole('button', { name: 'Open wizard' }));

    expect(open).toHaveBeenCalledWith('wizard', {
      context: { topic: 'modal round-trip' },
      onClose: expect.any(Function),
    });
  });

  it('renders the result returned by the dialog', () => {
    render(<Modals />);
    fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    const { onClose } = open.mock.calls[0][1];

    act(() => onClose({ confirmed: true }));

    expect(screen.getByTestId('Dialog result')).toHaveTextContent('{"confirmed":true}');
  });

  it('renders the result returned by the wizard', () => {
    render(<Modals />);
    fireEvent.click(screen.getByRole('button', { name: 'Open wizard' }));
    const { onClose } = open.mock.calls[0][1];

    act(() => onClose({ completed: true }));

    expect(screen.getByTestId('Wizard result')).toHaveTextContent('{"completed":true}');
  });

  it('shows a placeholder before any modal was opened', () => {
    render(<Modals />);

    expect(screen.getByTestId('Dialog result')).toHaveTextContent('not opened yet');
    expect(screen.getByTestId('Wizard result')).toHaveTextContent('not opened yet');
  });
});

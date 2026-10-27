import { act, renderHook, waitFor } from '@testing-library/react';

import { http } from '@mpt-extension/sdk';

import { MAX_POLL_FAILURES, TASKS_PATH, TASK_POLL_INTERVAL_MS } from '../constants';
import {
  MOCK_AGREEMENT_ID,
  MOCK_TASK_ID,
  mockDeferredAccepted,
  mockTaskResponse,
} from '../test-utils/agreement-mocks';
import { useAgreementSync } from './useAgreementSync';

jest.mock('@mpt-extension/sdk', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
  },
}), { virtual: true });

const mockGet = jest.mocked(http.get);
const mockPost = jest.mocked(http.post);

const TASK_PATH = `${TASKS_PATH}/${MOCK_TASK_ID}`;

describe('useAgreementSync', () => {
  const requestBackgroundSync = async () => {
    mockPost.mockResolvedValue(mockDeferredAccepted());
    const hook = renderHook(() => useAgreementSync(MOCK_AGREEMENT_ID));
    await act(async () => {
      await hook.result.current.requestAgreementSync();
    });
    return hook;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('posts the agreement id and records successful completion', async () => {
    mockPost.mockResolvedValue({ data: { data: {} } });

    const { result } = renderHook(() => useAgreementSync(MOCK_AGREEMENT_ID));

    await act(async () => {
      await result.current.syncAgreement();
    });

    expect(mockPost).toHaveBeenCalledWith('/api/v2/agreements/sync', { agreementId: MOCK_AGREEMENT_ID });
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.lastStatus).toBe('success');
    expect(result.current.lastCompleted).toEqual(expect.any(String));
    expect(result.current.error).toBe('');
  });

  it('requests a deferred sync with MPT-Async and follows the running task', async () => {
    mockGet.mockResolvedValue(mockTaskResponse('Processing', 40));

    const { result } = await requestBackgroundSync();

    expect(mockPost).toHaveBeenCalledWith(
      '/api/v2/agreements/sync',
      { agreementId: MOCK_AGREEMENT_ID },
      { headers: { 'MPT-Async': 'true' } },
    );
    await waitFor(() => expect(result.current.taskStatus).toBe('processing'));
    expect(mockGet).toHaveBeenCalledWith(TASK_PATH);
    expect(result.current.status).toBe('requested');
    expect(result.current.taskId).toBe(MOCK_TASK_ID);
    expect(result.current.taskProgress).toBe(40);
    expect(result.current.isTaskRunning).toBe(true);
    expect(result.current.lastCompleted).toBeNull();
  });

  it('polls the task until it is completed', async () => {
    jest.useFakeTimers();
    mockGet
      .mockResolvedValueOnce(mockTaskResponse('Processing'))
      .mockResolvedValueOnce(mockTaskResponse('Completed'));

    const { result } = await requestBackgroundSync();
    await waitFor(() => expect(result.current.taskStatus).toBe('processing'));

    await act(async () => {
      jest.advanceTimersByTime(TASK_POLL_INTERVAL_MS);
    });

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(mockGet.mock.calls.filter(([url]) => url === TASK_PATH)).toHaveLength(2);
    expect(result.current.isTaskRunning).toBe(false);
    expect(result.current.lastStatus).toBe('success');
    expect(result.current.lastCompleted).toEqual(expect.any(String));
  });

  it('records a failed background task', async () => {
    mockGet.mockResolvedValue(mockTaskResponse('Failed'));

    const { result } = await requestBackgroundSync();

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toBe(`Background sync task ${MOCK_TASK_ID} failed.`);
  });

  it('stops following the task after MAX_POLL_FAILURES unreadable reads', async () => {
    jest.useFakeTimers();
    mockGet.mockRejectedValue(new Error('Gateway timeout'));

    const { result } = await requestBackgroundSync();

    for (let attempt = 1; attempt < MAX_POLL_FAILURES; attempt += 1) {
      await act(async () => {
        jest.advanceTimersByTime(TASK_POLL_INTERVAL_MS);
      });
    }

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(mockGet).toHaveBeenCalledTimes(MAX_POLL_FAILURES);
    expect(result.current.error).toBe(
      `Background sync task ${MOCK_TASK_ID} could not be read.`,
    );
  });

  it('drops the tracked task when the portal switches agreement', async () => {
    mockPost.mockResolvedValue(mockDeferredAccepted());
    mockGet.mockResolvedValue(mockTaskResponse('Processing'));
    const { result, rerender } = renderHook(({ id }) => useAgreementSync(id), {
      initialProps: { id: MOCK_AGREEMENT_ID },
    });
    await act(async () => {
      await result.current.requestAgreementSync();
    });
    await waitFor(() => expect(result.current.taskStatus).toBe('processing'));

    rerender({ id: 'AGR-9999-9999-9999' });

    await waitFor(() => expect(result.current.status).toBe('idle'));
    expect(result.current.taskId).toBeNull();
  });

  it('ignores a sync that answers after the agreement changed', async () => {
    let resolvePost: ((value: unknown) => void) | undefined;
    mockPost.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePost = resolve;
        }),
    );
    mockGet.mockResolvedValue(mockTaskResponse('Processing'));
    const { result, rerender } = renderHook(({ id }) => useAgreementSync(id), {
      initialProps: { id: MOCK_AGREEMENT_ID },
    });
    act(() => {
      void result.current.requestAgreementSync();
    });
    rerender({ id: 'AGR-9999-9999-9999' });

    await act(async () => {
      resolvePost?.({ headers: { 'mpt-task-id': MOCK_TASK_ID } });
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.taskId).toBeNull();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('fails a background sync accepted without a task id', async () => {
    mockPost.mockResolvedValue({ headers: {} });

    const { result } = renderHook(() => useAgreementSync(MOCK_AGREEMENT_ID));
    await act(async () => {
      await result.current.requestAgreementSync();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(
      'Marketplace accepted the sync without returning a task id.',
    );
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not post when agreement id is missing', async () => {
    const { result } = renderHook(() => useAgreementSync(''));

    await act(async () => {
      await result.current.syncAgreement();
    });

    expect(mockPost).not.toHaveBeenCalled();
    expect(result.current.status).toBe('idle');
  });

  it('records sync failures', async () => {
    mockPost.mockRejectedValue(new Error('Marketplace unavailable'));

    const { result } = renderHook(() => useAgreementSync(MOCK_AGREEMENT_ID));

    await act(async () => {
      await result.current.syncAgreement();
    });

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.lastStatus).toBe('error');
    expect(result.current.lastCompleted).toEqual(expect.any(String));
    expect(result.current.error).toBe('Marketplace unavailable');
  });
});

import { useCallback, useEffect, useRef, useState } from 'react';

import { http } from '@mpt-extension/sdk';

import { MAX_POLL_FAILURES, SYNC_PATH, TASKS_PATH, TASK_POLL_INTERVAL_MS } from '../constants';

export type Status = 'idle' | 'loading' | 'requested' | 'success' | 'error';

export type SyncMode = 'direct' | 'deferred';

interface TaskPayload {
  progress?: number | null;
  status?: string;
}

interface SyncState {
  error: string;
  lastCompleted: string | null;
  lastStatus: Status | null;
  mode: SyncMode | null;
  status: Status;
  taskId: string | null;
  taskProgress: number | null;
  taskStatus: string | null;
}

const INITIAL_SYNC_STATE: SyncState = {
  error: '',
  lastCompleted: null,
  lastStatus: null,
  mode: null,
  status: 'idle',
  taskId: null,
  taskProgress: null,
  taskStatus: null,
};

function isFinal(taskStatus: string): boolean {
  return taskStatus === 'completed' || taskStatus === 'failed';
}

function applyTaskUpdate(
  current: SyncState,
  taskStatus: string,
  taskProgress: number | null,
): SyncState {
  const followed = { ...current, taskProgress, taskStatus };
  if (!isFinal(taskStatus)) {
    return followed;
  }

  const isFailed = taskStatus === 'failed';
  return {
    ...followed,
    error: isFailed ? `Background sync task ${current.taskId} failed.` : '',
    lastCompleted: new Date().toLocaleString(),
    lastStatus: isFailed ? 'error' : 'success',
    status: isFailed ? 'error' : 'success',
  };
}

export function useAgreementSync(agreementId: string) {
  const [state, setState] = useState<SyncState>(INITIAL_SYNC_STATE);
  const { status, taskId } = state;
  // The agreement the hook follows right now, for calls that started before a switch.
  const followedAgreement = useRef(agreementId);

  // The state belongs to one agreement: `useMPTContext` can hand the plug a different
  // one without remounting, and a task followed for the previous agreement must not
  // carry over. The plug follows a task only for as long as it is on screen.
  useEffect(() => {
    followedAgreement.current = agreementId;
    setState(INITIAL_SYNC_STATE);
  }, [agreementId]);

  // Follow a background sync until its Task is final.
  useEffect(() => {
    if (status !== 'requested' || !taskId) {
      return undefined;
    }

    let active = true;
    let failures = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      try {
        const response = await http.get<TaskPayload>(
          `${TASKS_PATH}/${encodeURIComponent(taskId)}`,
        );
        if (!active) {
          return;
        }
        failures = 0;
        const taskStatus = response.data.status?.toLowerCase() ?? null;
        const taskProgress = response.data.progress ?? null;
        if (taskStatus) {
          setState((current) => applyTaskUpdate(current, taskStatus, taskProgress));
          if (isFinal(taskStatus)) {
            return;
          }
        }
      } catch {
        // A read that lands after the effect was cleaned up belongs to an agreement the
        // plug no longer follows, so it must not touch the state.
        if (!active) {
          return;
        }
        failures += 1;
        if (failures >= MAX_POLL_FAILURES) {
          // The Task keeps running; this browser just stopped being able to read it.
          setState((current) => ({
            ...current,
            error: `Background sync task ${taskId} could not be read.`,
            lastStatus: 'error',
            status: 'error',
          }));
          return;
        }
      }
      if (active) {
        timer = setTimeout(() => void poll(), TASK_POLL_INTERVAL_MS);
      }
    };

    void poll();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [agreementId, status, taskId]);

  const runSync = useCallback(async (mode: SyncMode) => {
    if (!agreementId) {
      return;
    }

    setState((current) => ({
      ...current,
      error: '',
      mode,
      status: 'loading',
      taskId: null,
      taskProgress: null,
      taskStatus: null,
    }));

    // The context can hand the plug another agreement while the call is in flight; its
    // answer then belongs to an agreement the hook no longer follows.
    const stillFollowed = () => followedAgreement.current === agreementId;

    try {
      const body = { agreementId };
      if (mode === 'direct') {
        await http.post(SYNC_PATH, body);
        if (!stillFollowed()) {
          return;
        }
        setState((current) => ({
          ...current,
          lastCompleted: new Date().toLocaleString(),
          lastStatus: 'success',
          status: 'success',
        }));
        return;
      }

      // The Extension Service answers 202 with the id of the Task that runs the sync.
      const response = await http.post(SYNC_PATH, body, { headers: { 'MPT-Async': 'true' } });
      const requestedTaskId: string | undefined = response.headers?.['mpt-task-id'];
      if (!requestedTaskId) {
        throw new Error('Marketplace accepted the sync without returning a task id.');
      }
      if (!stillFollowed()) {
        return;
      }
      setState((current) => ({ ...current, status: 'requested', taskId: requestedTaskId }));
    } catch (syncError) {
      if (!stillFollowed()) {
        return;
      }
      const error = syncError instanceof Error ? syncError.message : 'Agreement sync failed.';
      setState((current) => ({
        ...current,
        error,
        lastCompleted: new Date().toLocaleString(),
        lastStatus: 'error',
        status: 'error',
      }));
    }
  }, [agreementId]);

  const requestAgreementSync = useCallback(() => runSync('deferred'), [runSync]);
  const syncAgreement = useCallback(() => runSync('direct'), [runSync]);

  return {
    ...state,
    isTaskRunning: status === 'requested',
    requestAgreementSync,
    syncAgreement,
  };
}

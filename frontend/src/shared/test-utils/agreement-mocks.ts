// Shared ids and payloads for the agreement sync tests (`useAgreementSync` and the
// `agreements-agreement` plug), so both drive the hook with the same Marketplace shapes.

export const MOCK_AGREEMENT_ID = 'AGR-1234-5678-9012';
export const MOCK_TASK_ID = 'TSK-1234-5678';

// `GET /public/v1/system/tasks/{id}` answers with the task itself, no `data` envelope.
export const mockTaskResponse = (status: string, progress?: number) => ({
  data: progress === undefined ? { status } : { progress, status },
});

// The Extension Service answers a deferred call with 202 and the task id in a header.
export const mockDeferredAccepted = () => ({ headers: { 'mpt-task-id': MOCK_TASK_ID } });

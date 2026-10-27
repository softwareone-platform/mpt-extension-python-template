// Configuration literals shared by the agreement sync hook and its tests.

export const SYNC_PATH = '/api/v2/agreements/sync';
// The plug reads the Task on the Marketplace API: `http` sends a platform path straight
// there, and the account that triggered the deferred call can read the Task it owns.
export const TASKS_PATH = '/public/v1/system/tasks';
export const TASK_POLL_INTERVAL_MS = 5000;
// A read can fail without the Task being in trouble, so it is retried; after this many
// failures in a row the plug stops following it.
export const MAX_POLL_FAILURES = 3;

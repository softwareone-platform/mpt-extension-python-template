import { useCallback, useMemo } from 'react';

import { http } from '@mpt-extension/sdk';
import { RqlQuery } from '@softwareone-platform/rql-client';
import { Card } from '@softwareone-platform/sdk-react-ui-v0/card';
import {
  CallApiParams,
  Grid,
  GridCellSimple,
  GridCellStatus,
  GridColumnDefinition,
  useGridWithRql,
} from '@softwareone-platform/sdk-react-ui-v0/grid';

import { ShowCode } from './elements/ShowCode';

const code = `
import { http } from '@mpt-extension/sdk';

// http is a pre-configured axios instance.
// It manages JWT tokens automatically — before each request it checks
// whether the current token is still valid and refreshes it if needed.
// Use it exactly like axios.

// Call the Marketplace API directly
const { data } = await http.get(
  '/public/v1/commerce/subscriptions',
  { params: { limit: 100, offset: 0 } },
);
const subscriptions = data.data; // array of subscription objects

// Or call your own extension backend
const agreement = await http.get('/api/v2/agreements/AGR-1234');
`;

interface Subscription {
  id: string;
  status: string;
  name: string;
  product: { id: string; name: string };
}

const STATUS_MAP: Record<string, 'success' | 'error' | 'info' | 'inactive'> = {
  Active: 'success',
  Terminated: 'error',
  Terminating: 'inactive',
  Updating: 'info',
};

const columns: GridColumnDefinition<Subscription>[] = [
  {
    name: 'id',
    title: 'ID',
    initialWidth: 180,
    cell: (item) => <GridCellSimple>{item.id}</GridCellSimple>,
  },
  {
    name: 'name',
    title: 'Name',
    initialWidth: 240,
    cell: (item) => <GridCellSimple>{item.name}</GridCellSimple>,
  },
  {
    name: 'product',
    title: 'Product',
    initialWidth: 240,
    cell: (item) => <GridCellSimple>{item.product?.name ?? '—'}</GridCellSimple>,
  },
  {
    name: 'status',
    title: 'Status',
    initialWidth: 140,
    cell: (item) => <GridCellStatus status={STATUS_MAP[item.status] ?? 'inactive'} label={item.status} />,
  },
];

export function Api() {
  const gridConfig = useMemo(
    () => ({
      id: 'api-subscriptions-grid',
      columns,
      paging: { page: 1, pageSize: 10, total: 0 },
      isToHideToolbar: true,
    }),
    [],
  );

  const callApi = useCallback(async (query: RqlQuery<Subscription>, { controller }: CallApiParams) => {
    const { data } = await http.get(`/public/v1/commerce/subscriptions?${query.toString()}`, {
      signal: controller.signal,
    });
    return {
      data: data.data as Subscription[],
      total: data.$meta.pagination.total as number,
    };
  }, []);

  const gridProps = useGridWithRql(gridConfig, callApi);

  return (
    <>
      <h2>API calls</h2>
      <p>
        The SDK provides <code>http</code>, a pre-configured axios instance that manages JWT
        authentication automatically. Before each request it checks whether the token is still valid
        (with a 60-second buffer) and transparently refreshes it when needed. Use it exactly like axios
        — no manual token handling required.
      </p>
      <p>
        All platform APIs are proxied through the extension domain, so you can call them using relative
        paths like <code>/public/v1/...</code> — there is no need to specify the full platform
        hostname.
      </p>

      <h3>Live: subscriptions from the Marketplace API</h3>
      <p>
        The grid below is populated by a real <code>GET /public/v1/commerce/subscriptions</code> call
        made with <code>http</code> from the SDK. Pagination, sorting, and filtering are handled
        server-side via RQL queries.
      </p>

      <Card>
        <Grid {...gridProps} />
      </Card>

      <h3>Usage</h3>
      <ShowCode>{code}</ShowCode>
    </>
  );
}

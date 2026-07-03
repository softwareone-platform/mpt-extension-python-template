import { Card } from '@softwareone-platform/sdk-react-ui-v0/card';
import {
  Grid,
  GridCellSimple,
  GridColumnDefinition,
  useGridInMemory,
} from '@softwareone-platform/sdk-react-ui-v0/grid';

import { ShowCode } from './ShowCode';

const code = `
interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
}

const people: Person[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', role: 'Admin' },
  { id: '2', name: 'Alan Turing', email: 'alan@example.com', role: 'Developer' },
  { id: '3', name: 'Grace Hopper', email: 'grace@example.com', role: 'Developer' },
];

const peopleColumns: GridColumnDefinition<Person>[] = [
  { name: 'name', title: 'Name', initialWidth: 200,
    cell: (item) => <GridCellSimple>{item.name}</GridCellSimple> },
  { name: 'email', title: 'Email', initialWidth: 260,
    cell: (item) => <GridCellSimple>{item.email}</GridCellSimple> },
  { name: 'role', title: 'Role', initialWidth: 140,
    cell: (item) => <GridCellSimple>{item.role}</GridCellSimple> },
];

const peopleGridConfig = {
  id: 'elements-people-grid',
  columns: peopleColumns,
  paging: { page: 1, pageSize: 10, total: people.length },
};

function PeopleGrid() {
  const gridProps = useGridInMemory(people, peopleGridConfig);
  return <Grid {...gridProps} />;
}
`;

interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
}

const people: Person[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', role: 'Admin' },
  { id: '2', name: 'Alan Turing', email: 'alan@example.com', role: 'Developer' },
  { id: '3', name: 'Grace Hopper', email: 'grace@example.com', role: 'Developer' },
];

const peopleColumns: GridColumnDefinition<Person>[] = [
  {
    name: 'name',
    title: 'Name',
    initialWidth: 200,
    cell: (item) => <GridCellSimple>{item.name}</GridCellSimple>,
  },
  {
    name: 'email',
    title: 'Email',
    initialWidth: 260,
    cell: (item) => <GridCellSimple>{item.email}</GridCellSimple>,
  },
  {
    name: 'role',
    title: 'Role',
    initialWidth: 140,
    cell: (item) => <GridCellSimple>{item.role}</GridCellSimple>,
  },
];

const peopleGridConfig = {
  id: 'elements-people-grid',
  columns: peopleColumns,
  paging: { page: 1, pageSize: 10, total: people.length },
};

export function GridExample() {
  const gridProps = useGridInMemory(people, peopleGridConfig);

  return (
    <>
      <h2>Grid</h2>
      <p>
        The <code>Grid</code> renders tabular data with sorting, filtering, pagination, and a toolbar
        out of the box. For a small client-side dataset, feed it through <code>useGridInMemory</code>{' '}
        and spread the result into <code>&lt;Grid/&gt;</code>. For server-driven data use{' '}
        <code>useGridWithRql</code> or <code>useGridAsync</code>.
      </p>

      <Card>
        <Grid {...gridProps} />
      </Card>

      <ShowCode>{code}</ShowCode>
    </>
  );
}

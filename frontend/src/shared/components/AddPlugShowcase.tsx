import { useState } from 'react';

import { useMPTContext, useMPTModal } from '@mpt-extension/sdk-react';
import { Button } from '@softwareone-platform/sdk-react-ui-v0/button';
import { Card } from '@softwareone-platform/sdk-react-ui-v0/card';
import { Divider } from '@softwareone-platform/sdk-react-ui-v0/divider';
import { Input } from '@softwareone-platform/sdk-react-ui-v0/input';
import { Switcher } from '@softwareone-platform/sdk-react-ui-v0/switcher';

import './AddPlugShowcase.scss';

type Format = 'yaml' | 'json';

const formatOptions = [
  { value: 'yaml', label: 'YAML' },
  { value: 'json', label: 'JSON' },
];

interface PlugConfig {
  id: string;
  name: string;
  description: string;
  href: string;
  condition: string;
}

function toYaml(plug: PlugConfig, socket: string): string {
  const lines = [`- id: ${plug.id}`, `  socket: ${socket}`];
  if (plug.name) lines.push(`  name: ${plug.name}`);
  if (plug.description) lines.push(`  description: ${plug.description}`);
  if (plug.href) lines.push(`  href: ${plug.href}`);
  if (plug.condition) lines.push(`  condition: "${plug.condition}"`);
  return lines.join('\n');
}

function toJson(plug: PlugConfig, socket: string): string {
  const obj: Record<string, string> = { id: plug.id, socket };
  if (plug.name) obj.name = plug.name;
  if (plug.description) obj.description = plug.description;
  if (plug.href) obj.href = plug.href;
  if (plug.condition) obj.condition = plug.condition;
  return JSON.stringify(obj, null, 2);
}

/**
 * SDK UI showcase: a "plug here" form whose target socket is supplied by the
 * per-socket module that mounts it. Each socket has its own thin module entry
 * (src/modules/add-*), so no build-time socket injection or shared socket
 * manifest is needed — the socket travels as an ordinary prop.
 */
export function AddPlugShowcase({ socket }: { socket: string }) {
  const { close } = useMPTModal();
  const context = useMPTContext();
  const [format, setFormat] = useState<Format>('yaml');
  const [plug, setPlug] = useState<PlugConfig>({
    id: '',
    name: '',
    description: '',
    href: '/static/',
    condition: '',
  });

  const update =
    (field: keyof PlugConfig) => (e: React.ChangeEvent<unknown>) =>
      setPlug((p) => ({ ...p, [field]: (e.target as HTMLInputElement).value }));

  const output = format === 'yaml' ? toYaml(plug, socket) : toJson(plug, socket);

  const body = (
    <>
      <p>
        Fill in the fields below to generate plug configuration. In this template plugs are declared
        in Python via a <code>PlugRouter</code> — but the same fields (<code>id</code>,{' '}
        <code>name</code>, <code>description</code>, <code>socket</code>, <code>href</code>,{' '}
        <code>condition</code>) map one-to-one, so you can use this as a scratchpad. Then build a JS
        bundle at the <code>href</code> path you specified.
      </p>

      <div className="add-plug__form">
        <Input
          name="id"
          label="Plug ID"
          placeholder="my-plug"
          value={plug.id}
          onChange={update('id')}
          description="Unique identifier (required)"
        />
        <Input
          name="name"
          label="Name"
          placeholder="My Plug"
          value={plug.name}
          onChange={update('name')}
        />
        <Input
          name="description"
          label="Description"
          placeholder="Short description"
          value={plug.description}
          onChange={update('description')}
        />
        <Input
          name="href"
          label="Bundle href"
          placeholder="/static/my-plug/index.js"
          value={plug.href}
          onChange={update('href')}
          description="Relative path to the JS bundle"
        />
        <Input
          name="condition"
          label="Condition (RQL)"
          placeholder="eq(product.id,PRD-1234-5678)"
          value={plug.condition}
          onChange={update('condition')}
          description="Optional RQL expression to control visibility"
        />

        <details className="add-plug__context">
          <summary>Current context</summary>
          <pre>
            <code>{JSON.stringify(context, null, 2)}</code>
          </pre>
        </details>
      </div>

      <Divider />

      <Switcher
        name="format"
        label="Output format"
        options={formatOptions}
        value={format}
        onChange={(e) => setFormat(e.target.value as Format)}
      />
      <div className="add-plug__output">
        <pre>
          <code>{output}</code>
        </pre>
      </div>
    </>
  );

  if (socket.endsWith('.actions')) {
    return (
      <div className="dialog">
        <div className="dialog__header">
          <div className="dialog__title">Add a Plug to {socket}</div>
        </div>
        <div className="dialog__content">{body}</div>
        <div className="dialog__actions">
          <div />
          <Button type="secondary" onClick={() => close()}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (socket === 'portal') {
    return <Card>{body}</Card>;
  }

  return <div className="add-plug">{body}</div>;
}

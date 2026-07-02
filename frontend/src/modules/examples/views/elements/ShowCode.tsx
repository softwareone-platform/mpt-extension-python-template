import { useState } from 'react';

import './ShowCode.scss';

export function ShowCode({ children }: { children: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="show-code">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className="show-code__toggle"
      >
        {open ? 'Less' : 'More'}
      </a>
      {open && (
        <pre>
          <code>{children.trim()}</code>
        </pre>
      )}
    </div>
  );
}

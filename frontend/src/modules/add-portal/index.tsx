import '../../fixes/safe-storage';

import { setup } from '@mpt-extension/sdk';
import { createRoot } from 'react-dom/client';

import { AddPlugShowcase } from '../../shared/components/AddPlugShowcase';
import '../../style.scss';

setup((element: Element) => {
  const root = createRoot(element);

  root.render(<AddPlugShowcase socket="portal" />);
});

import { Card } from '@softwareone-platform/sdk-react-ui-v0/card';
import { InlineMarkdown } from '@softwareone-platform/sdk-react-ui-v0/markdown/inline';

import text from './text.md';

export default function App() {
  return (
    <Card>
      <InlineMarkdown
        value={text}
        styleOverrides={{
          h1: '__h1',
          h2: '__h2',
          h3: '__h3',
          code: '__code',
          pre: '__pre',
        }}
      />
    </Card>
  );
}

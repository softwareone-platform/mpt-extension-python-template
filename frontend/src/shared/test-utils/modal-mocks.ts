// Shared factories for the modal plug and Modals view tests (`dialog`,
// `wizard`, examples `Modals`). Names are prefixed with `mock` so
// babel-plugin-jest-hoist allows referencing them from `jest.mock(...)` calls
// (which get hoisted above imports).

export const mockMptSdkReactFactory = () => ({
  useMPTContext: jest.fn(),
  useMPTModal: jest.fn(),
});

export const mockButtonFactory = () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Button: ({ children, onClick }: { children?: import('react').ReactNode; onClick?: () => void }) =>
      React.createElement('button', { onClick }, children),
  };
};

export const mockTextFactory = () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const renderText = ({ as = 'span', children }: { as?: string; children?: import('react').ReactNode }) =>
    React.createElement(as, null, children);
  return {
    BoldText: renderText,
    RegularText: renderText,
  };
};

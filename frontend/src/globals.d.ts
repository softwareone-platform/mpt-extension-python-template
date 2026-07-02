declare module '*.scss';

declare module '*.md' {
  const content: string;
  export default content;
}

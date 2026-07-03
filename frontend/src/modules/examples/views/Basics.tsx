export function Basics() {
  return (
    <>
      <h1>Here come the basics</h1>
      <p>Setting up an Extension UI takes two steps. First, install the SDK:</p>
      <pre>
        <code>npm i @mpt-extension/sdk</code>
      </pre>
      <p>
        Then, in your module&apos;s entry point, call <code>setup()</code> with a callback that mounts
        your React app into the provided root element. The platform invokes the callback once the
        iframe is ready and the root node is attached to the DOM:
      </p>
      <pre>
        <code>{`
import { setup } from '@mpt-extension/sdk';
import { createRoot } from 'react-dom/client';
import App from './App';

setup((element: Element) => {
  const root = createRoot(element);
  root.render(<App/>);
});
`}</code>
      </pre>
      <p>
        That is all the wiring required — from here you can use the SDK hooks to read context, emit
        events, call APIs, and open modals.
      </p>

      <h2>Routing</h2>
      <p>
        Extension UI routing is synchronised with the platform&apos;s URL. The platform&apos;s current
        page path is suffixed with <code>/-/</code> followed by the extension&apos;s own internal path.
        So if the platform page lives at <code>/foo</code> and your extension defines a route{' '}
        <code>/bar</code>, the address bar shows <code>/foo/-/bar</code>. Following such a URL as a
        link delivers the inner path (<code>/bar</code>) to the Extension UI, and the SDK keeps the
        two halves in sync as the user navigates inside your app.
      </p>
      <p>
        In practice you just use <code>react-router</code> as you normally would — declare your
        routes, call <code>useNavigate()</code>, read <code>useParams()</code>. This very page is a
        working example: each tab is bound to a route segment and clicking a tab triggers a{' '}
        <code>navigate()</code> call, which is reflected in the platform URL.
      </p>
    </>
  );
}

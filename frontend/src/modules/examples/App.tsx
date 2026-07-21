import { useEffect } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router';

import { Tab, Tabs } from '@softwareone-platform/sdk-react-ui-v0/tabs';
import { DesignSystemOptionsProvider } from '@softwareone-platform/sdk-react-ui-v0/utils';

import { Api } from './views/Api';
import { Basics } from './views/Basics';
import { Context } from './views/Context';
import { Elements } from './views/Elements';
import { Intro } from './views/Intro';
import { Modals } from './views/Modals';

function View() {
  const { tab } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tab) {
      // replace so the bare "/" entry doesn't trap back navigation
      navigate('/intro', { replace: true });
    }
  }, [tab, navigate]);

  if (!tab) {
    return null;
  }

  return (
    <DesignSystemOptionsProvider
      value={{
        dateFormat: 'dd MMM yyyy',
        inputDateFormat: 'P',
        languageCode: 'en-GB',
        timeFormat: 'HH:mm',
      }}
    >
      <Tabs selectedTabId={tab} onTabChange={(id) => navigate(`/${id}`)}>
        <Tab id="intro" title="Introduction">
          <Tab.Content>
            <Intro />
          </Tab.Content>
        </Tab>
        <Tab id="basics" title="Basics">
          <Tab.Content>
            <Basics />
          </Tab.Content>
        </Tab>
        <Tab id="elements" title="UI elements">
          <Tab.Content>
            <Elements />
          </Tab.Content>
        </Tab>
        <Tab id="context" title="Context">
          <Tab.Content>
            <Context />
          </Tab.Content>
        </Tab>
        <Tab id="api" title="API calls">
          <Tab.Content>
            <Api />
          </Tab.Content>
        </Tab>
        <Tab id="modals" title="Modals">
          <Tab.Content>
            <Modals />
          </Tab.Content>
        </Tab>
      </Tabs>
    </DesignSystemOptionsProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/:tab" element={<View />} />
      <Route path="/" element={<View />} />
    </Routes>
  );
}

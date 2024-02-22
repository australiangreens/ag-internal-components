import { useAtomValue } from 'jotai';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout, domainCodeAtom } from 'ag-internal-components';
import SettingsEtcPlaceholder from '../layouts/AppLayout/NavBar/SettingsEtcPlaceholder';
import AutocompleteDemo from './AutocompleteDemo';
import DomainCodeDemo from './DomainCodeDemo';
import ExampleComponentDemo from './ExampleComponentDemo';
import NavBarContent from './NavBarContent';
import NavBarTopDemo from './NavBarTopDemo';
import SaladBarDemo from './SaladBarDemo';
import SomeRandomDemo from './SomeRandomDemo';
import TopBarMiddleDemo from './TopBarMiddleDemo';

const queryClient = new QueryClient();

export default function DevDemo() {
  const domainCode = useAtomValue(domainCodeAtom);

  // This is a sample user, with sample user stuff. In a real situation, this
  // information would be derived from CiviCRM. We want to

  const user = {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/roles//groups': [
      'Local EMS Admin',
      'Local Group Admin',
      'National Officer',
      'Local EMS User',
      'gVIRS User',
      'State Officer',
      'Local Group Mail',
      'gVIRS Coordinator',
    ],
    given_name: 'Given',
    family_name: 'Family',
    nickname: 'Nickname',
    name: 'Auth0 Username', // This should be the single source of truth!!
    picture: 'https://greens.org.au/themes/greens/logo.svg', //
    updated_at: '2024-02-21T04:09:13.094Z',
    email: 'givenfamily@gmail.com',
    email_verified: true,
    sub: 'auth0|randomhex',
  };

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppLayout
          navBarMiddle={<NavBarContent />}
          navBarBottom={<SettingsEtcPlaceholder />}
          initialNavBarOpen={true}
          initialTitleText="OurAppName"
          domainCode={domainCode}
          user={user}
        >
          <Routes>
            <Route index element={<ExampleComponentDemo />} />
            <Route path="/exampleComponentDemo" element={<ExampleComponentDemo />} />
            <Route path="/saladBarDemo" element={<SaladBarDemo />} />
            <Route path="/navBarTopDemo" element={<NavBarTopDemo />} />
            <Route path="/topBarMiddleDemo" element={<TopBarMiddleDemo />} />
            <Route path="/someRandom" element={<SomeRandomDemo />} />
            <Route path="/domainCode" element={<DomainCodeDemo />} />
            <Route path="/autocomplete" element={<AutocompleteDemo />} />
          </Routes>
        </AppLayout>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

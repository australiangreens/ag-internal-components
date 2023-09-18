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

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppLayout
          navBarMiddle={<NavBarContent />}
          navBarBottom={<SettingsEtcPlaceholder />}
          initialNavBarOpen={true}
          initialTitleText="OurAppName"
          domainCode={domainCode}
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

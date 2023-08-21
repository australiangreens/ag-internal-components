import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAtomValue } from 'jotai';

import { AppLayout, domainCodeAtom } from 'ag-internal-components';
import DomainCodeDemo from './DomainCodeDemo';
import ExampleComponentDemo from './ExampleComponentDemo';
import NavBarContent from './NavBarContent';
import SaladBarDemo from './SaladBarDemo';
import SomeRandomDemo from './SomeRandomDemo';
import SpecialPageDemo from './SpecialPageDemo';
import SettingsEtcPlaceholder from '../layouts/AppLayout/NavBar/SettingsEtcPlaceholder';

export default function DevDemo() {
  const domainCode = useAtomValue(domainCodeAtom);

  return (
    <BrowserRouter>
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
          <Route path="/specialDemo" element={<SpecialPageDemo />} />
          <Route path="/someRandom" element={<SomeRandomDemo />} />
          <Route path="/domainCode" element={<DomainCodeDemo />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

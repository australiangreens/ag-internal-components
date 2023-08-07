import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { AppLayout } from '..';
import NavBarContent from './NavBarContent';
import ExampleComponentDemo from './ExampleComponentDemo';
import SaladBarDemo from './SaladBarDemo';
import SomeRandomDemo from './SomeRandomDemo';
import SpecialPageDemo from './SpecialPageDemo';
import DomainCodeDemo from './DomainCodeDemo';

export default function DevDemo() {
  return (
    <BrowserRouter>
      <AppLayout
        navBarMiddle={<NavBarContent />}
        initialNavBarOpen={true}
        initialTitleText="OurAppName"
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

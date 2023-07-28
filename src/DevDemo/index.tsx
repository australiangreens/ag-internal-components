import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { AppLayout } from '..';
import NavBarContent from './NavBarContent';
import ExampleComponentDemo from './ExampleComponentDemo';
import SaladBarDemo from './SaladBarDemo';

export default function DevDemo() {
  return (
    <BrowserRouter>
      <AppLayout navBarContent={<NavBarContent />}>
        <Routes>
          <Route index element={<ExampleComponentDemo />} />
          <Route path="/ExampleComponentDemo" element={<ExampleComponentDemo />} />
          <Route path="/SaladBarDemo" element={<SaladBarDemo />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';

import { NavBar, NavBarProvider } from '..';
import NavBarContent from './NavBarContent';
import ExampleComponentDemo from './ExampleComponentDemo';
import SaladBarDemo from './SaladBarDemo';

export default function DevDemo() {
  return (
    <BrowserRouter>
      <Box display="flex" flexDirection="column" height="100vh">
        <Box display="flex" position="relative" flexGrow={1} overflow="hidden">
          <NavBarProvider>
            <NavBar>
              <NavBarContent />
            </NavBar>
            <Box component="main" id="main-content" flexGrow={1} overflow="auto" tabIndex={-1}>
              <Routes>
                <Route index element={<ExampleComponentDemo />} />
                <Route path="/ExampleComponentDemo" element={<ExampleComponentDemo />} />
                <Route path="/SaladBarDemo" element={<SaladBarDemo />} />
              </Routes>
            </Box>
          </NavBarProvider>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

// TODO: Temp to fix weird issue with Providers and Route
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { createContext } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';

import NavBar from './NavBar';
import ExampleComponentDemo from './ExampleComponentDemo';
import SaladBarDemo from './SaladBarDemo';

export const NavbarContext = createContext({ open: true }); // temp

export default function DevDemo() {
  const navBarOpen = true;

  return (
    <BrowserRouter>
      <NavbarContext.Provider value={{ open: navBarOpen }}>
        <Box display="flex" flexDirection="column" height="100vh">
          <Box display="flex" position="relative" flexGrow={1} overflow="hidden">
            <NavBar open={navBarOpen}></NavBar>
            <Box component="main" id="main-content" flexGrow={1} overflow="auto" tabIndex={-1}>
              <Routes>
                <Route index element={<ExampleComponentDemo />} />
                <Route path="/ExampleComponentDemo" element={<ExampleComponentDemo />} />
                <Route path="/SaladBarDemo" element={<SaladBarDemo />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </NavbarContext.Provider>
    </BrowserRouter>
  );
}

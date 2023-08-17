import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import DevApp from './DevApp';
import './index.css';

const container = document.getElementById('root') as Element;
const root = createRoot(container);
root.render(
  <StrictMode>
    <DevApp />
  </StrictMode>
);

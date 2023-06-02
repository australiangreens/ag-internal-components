import { StrictMode } from 'react';
import { render } from 'react-dom';
import DevApp from './DevApp';
import './index.css';

render(
  <StrictMode>
    <DevApp />
  </StrictMode>,
  document.getElementById('root')
);

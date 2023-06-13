import { StrictMode } from 'react';
import { render } from 'react-dom';
import DevApp from './DevApp';
import './index.css';

render(
  // Should be resolved when we move to React >= 18
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <StrictMode>
    <DevApp />
  </StrictMode>,
  document.getElementById('root')
);

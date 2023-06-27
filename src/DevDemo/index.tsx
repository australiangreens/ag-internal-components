import { SyntheticEvent, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import ExampleComponentDemo from './ExampleComponentDemo';
import SaladBarDemo from './SaladBarDemo';

const demoComponents = ['ExampleComponent', 'SaladBar'];

type ComponentTabId = (typeof demoComponents)[number];

export default function DevDemo() {
  const [tabId, setTabId] = useState<ComponentTabId>('ExampleComponent');

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tabId}
        onChange={(event: SyntheticEvent, newValue: string) => {
          setTabId(newValue);
        }}
      >
        {demoComponents.map((x) => (
          <Tab key={x} value={x} label={x} />
        ))}
      </Tabs>
      <br />
      <br />

      <Box>
        {tabId === 'ExampleComponent' && <ExampleComponentDemo />}

        {tabId === 'SaladBar' && <SaladBarDemo />}
      </Box>
    </Box>
  );
}

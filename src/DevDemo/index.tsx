import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

import { ExampleComponent, useSaladBar } from '..';

export default function DevDemo() {
  const [saladCount, setSaladCount] = useState(0);

  const { enqueueNotification } = useSaladBar();

  useEffect(() => {
    enqueueNotification({ message: `First message`, severity: 'success' });
    enqueueNotification({ message: `Second message`, severity: 'success' });
    enqueueNotification({ message: `Third message`, severity: 'success' });
    // [LIST-471] Avoid loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ExampleComponent text="Some text" />
      <br />
      <br />
      <Button
        variant="outlined"
        onClick={() => {
          enqueueNotification({ message: `Hello I am a message ${saladCount}`, severity: 'info' });
          setSaladCount((prev) => prev + 1);
        }}
        aria-label="Enqueue SaladBar message"
      >
        Enqueue SaladBar message
      </Button>
    </>
  );
}

import { useState } from 'react';
import Button from '@mui/material/Button';

import { PageLayout, useSaladBar, NAVBAR_WIDTH_OPENED, NAVBAR_WIDTH_CLOSED, useNavBar } from '..';

export default function SaladBarDemo() {
  const { open: navBarOpen } = useNavBar();
  const [saladCount, setSaladCount] = useState(0);
  const { enqueueNotification } = useSaladBar();

  return (
    <PageLayout
      titleText={'ExampleComponent'}
      navBarOpen={navBarOpen}
      navBarWidthOpen={NAVBAR_WIDTH_OPENED}
      navBarWidthClosed={NAVBAR_WIDTH_CLOSED}
    >
      <Button
        variant="outlined"
        onClick={() => {
          enqueueNotification({
            message: `Hello I am a message ${saladCount}`,
            severity: 'info',
          });
          setSaladCount((prev) => prev + 1);
        }}
        aria-label="Enqueue SaladBar message"
      >
        Enqueue SaladBar message
      </Button>
    </PageLayout>
  );
}

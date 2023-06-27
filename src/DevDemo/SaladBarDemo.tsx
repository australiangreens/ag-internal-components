import { useState, useContext } from 'react';
import Button from '@mui/material/Button';

import { PageLayout, useSaladBar } from '..';
import { NAVBAR_WIDTH_OPENED, NAVBAR_WIDTH_CLOSED } from './NavBar';
import { NavbarContext } from '.';

export default function SaladBarDemo() {
  const { open: navBarOpen } = useContext(NavbarContext);
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

import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

import { navBarTopAtom, useSaladBar, useSetLibraryAtom } from '..';

export default function SaladBarDemo() {
  const [saladCount, setSaladCount] = useState(0);
  const { enqueueNotification } = useSaladBar();
  const setNavBarTop = useSetLibraryAtom(navBarTopAtom);

  useEffect(() => {
    setNavBarTop(undefined);
  }, [setNavBarTop]);

  return (
    <>
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
    </>
  );
}

import Button from '@mui/material/Button';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { navBarTopAtom, topBarMiddleAtom, useSaladBar } from 'ag-internal-components';

export default function SaladBarDemo() {
  const [saladCount, setSaladCount] = useState(0);
  const { enqueueNotification } = useSaladBar();
  const setNavBarTop = useSetAtom(navBarTopAtom);
  const setTopBarMiddle = useSetAtom(topBarMiddleAtom);

  useEffect(() => {
    setNavBarTop(undefined);
    setTopBarMiddle(undefined);
  }, [setNavBarTop, setTopBarMiddle]);

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

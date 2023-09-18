import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

import { DomainCodeDialog, navBarTopAtom, topBarMiddleAtom } from 'ag-internal-components';
import { useSetAtom } from 'jotai';

const DomainCodeDemo = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const setNavBarTop = useSetAtom(navBarTopAtom);
  const setTopBarMiddle = useSetAtom(topBarMiddleAtom);

  useEffect(() => {
    setNavBarTop(undefined);
    setTopBarMiddle(undefined);
  }, [setNavBarTop, setTopBarMiddle]);

  return (
    <div>
      <h1>DomainCode example</h1>
      <Button onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>
      <DomainCodeDialog
        applicationName="Example Manager"
        handleLogout={() => console.log('Logout')}
        isOpen={isDialogOpen}
        onClose={async () => setIsDialogOpen(false)}
        domainOptions={['act', 'nsw']}
        isLoading={false}
        key={isDialogOpen ? 'domainCodeDialogOpen' : 'domainCodeDialogClosed'}
      />
    </div>
  );
};

export default DomainCodeDemo;

import { Button } from '@mui/material';
import { useState } from 'react';

import { DomainCodeDialog } from 'ag-internal-components';

const DomainCodeDemo = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

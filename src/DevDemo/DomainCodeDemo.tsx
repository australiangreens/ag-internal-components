import { Button } from '@mui/material';
import { useState } from 'react';
import DomainCodeDialog from 'src/domainCode/DomainCodeDialog';

const DomainCodeDemo = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div>
      <h1>DomainCode example</h1>
      <Button onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>
      <DomainCodeDialog
        isOpen={isDialogOpen}
        onClose={async () => setIsDialogOpen(false)}
        domainOptions={['ag', 'act']}
        isLoading={false}
        key={isDialogOpen ? 'domainCodeDialogOpen' : 'domainCodeDialogClosed'}
      />
    </div>
  );
};

export default DomainCodeDemo;

import {
  Logout as LogoutIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  SpaceDashboard as SwitchToIcon,
} from '@mui/icons-material';
import { List } from '@mui/material';
import { useState } from 'react';
import { NavBarLink } from 'src/components';
import AgDialog from '../../../components/AgDialog/AgDialog';

export default function SettingsEtcPlaceholder() {
  const [dialogValue, setDialogValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = (menuName: string) => {
    setDialogValue(menuName);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <List>
        <NavBarLink
          label="Training Hub"
          icon={<SchoolIcon />}
          to="https://training.greens.org.au/"
          openInNewWindow
          tooltip="Where all training guides are found"
        />
        <NavBarLink
          label="Settings"
          icon={<SettingsIcon />}
          onClick={() => handleDialogOpen('Settings')}
        />
        <NavBarLink
          label="Switch apps"
          icon={<SwitchToIcon />}
          subMenu={[
            { label: '1. Something', onClick: () => handleDialogOpen('1. Something') },
            { label: '2. Something else', onClick: () => handleDialogOpen('2. Something else') },
            { label: '3. Puppies!', onClick: () => handleDialogOpen('3. Puppies!') },
          ]}
          extraSubIndentSpace={3}
        />

        <NavBarLink
          label="Log out"
          icon={<LogoutIcon />}
          onClick={() => handleDialogOpen('Log out')}
        />
      </List>
      <AgDialog
        isOpen={dialogOpen}
        dialogTitle={dialogValue}
        onClose={handleDialogClose}
        disableCloseOnBackdropOrEscape
      >
        <p>
          You just pressed the <em>{dialogValue}</em> menu item.
        </p>
      </AgDialog>
    </>
  );
}

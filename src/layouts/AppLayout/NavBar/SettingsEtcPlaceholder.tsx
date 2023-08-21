import { useState } from 'react';
import {
  SpaceDashboard as SwitchToIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import AgDialog from '../../../components/AgDialog/AgDialog';

interface SettingsEtcPlaceholderProps {
  navBarOpen: boolean;
}

export default function SettingsEtcPlaceholder({ navBarOpen }: SettingsEtcPlaceholderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
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
        <ListItemButton onClick={() => setMenuOpen((prev: boolean) => !prev)}>
          <ListItemIcon>
            <SwitchToIcon />
          </ListItemIcon>
          <ListItemText primary="Switch to ..." />
          {menuOpen && navBarOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>

        <Collapse in={menuOpen && navBarOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 2 }} onClick={() => handleDialogOpen('1. Something')}>
              <ListItemText primary="1. Something" inset />
            </ListItemButton>
            <ListItemButton sx={{ pl: 2 }} onClick={() => handleDialogOpen('2. Something else')}>
              <ListItemText primary="2. Something else" inset />
            </ListItemButton>
            <ListItemButton sx={{ pl: 2 }} onClick={() => handleDialogOpen('3. Puppies!')}>
              <ListItemText primary="3. Puppies!" inset />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={() => handleDialogOpen('Settings')}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

        <ListItemButton onClick={() => handleDialogOpen('Log out')}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </ListItemButton>
      </List>
      <AgDialog isOpen={dialogOpen} dialogTitle={dialogValue} onClose={handleDialogClose}>
        <p>
          You just pressed the <em>{dialogValue}</em> menu item.
        </p>
      </AgDialog>
    </>
  );
}

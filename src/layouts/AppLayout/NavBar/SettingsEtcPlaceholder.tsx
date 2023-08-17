import { useState } from 'react';
import {
  Dashboard as SwitchToIcon, // TODO: The SpaceDashboard icon in figma design is not in MUI 5.11.0
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

interface SettingsEtcPlaceholderProps {
  navBarOpen: boolean;
}

export default function SettingsEtcPlaceholder({ navBarOpen }: SettingsEtcPlaceholderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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
          <ListItemButton sx={{ pl: 2 }}>
            <ListItemText primary="1. Something" inset />
          </ListItemButton>
          <ListItemButton sx={{ pl: 2 }}>
            <ListItemText primary="2. Something else" inset />
          </ListItemButton>
          <ListItemButton sx={{ pl: 2 }}>
            <ListItemText primary="3. Puppies!" inset />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Log out" />
      </ListItemButton>
    </List>
  );
}

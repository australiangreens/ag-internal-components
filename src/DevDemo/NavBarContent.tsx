import { useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { ListItemButton, ListItemText, ListItemIcon, List, Collapse } from '@mui/material';
// import { List as ExampleIcon, Home as SaladIcon } from '@mui/icons-material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
// import StarBorder from '@mui/icons-material/StarBorder';
// import { useLocation } from 'react-router-dom';

export default function NavBarContent() {
  // const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <List
      component="nav"
      sx={{
        width: '100%',
        maxWidth: (theme) => theme.navBar.widthOpen,
      }}
    >
      <ListItemButton>
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary="Sent mail" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <DraftsIcon />
        </ListItemIcon>
        <ListItemText primary="Drafts" />
      </ListItemButton>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 2 }}>
            <ListItemText primary="1. Basic Info" inset />
          </ListItemButton>
          <ListItemButton sx={{ pl: 2 }}>
            <ListItemText primary="2. Next bit" inset />
          </ListItemButton>
          <ListItemButton sx={{ pl: 2 }}>
            <ListItemText primary="3. Another thing" inset />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}

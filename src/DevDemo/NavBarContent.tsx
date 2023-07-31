import { useState } from 'react';
import { ListItemButton, ListItemText, ListItemIcon, List, Collapse } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// interface NavBarContentProps {}

export default function NavBarContent() {
  // const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <List component="nav">
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

import {
  Add as AddIcon,
  Drafts as DraftsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Inbox as InboxIcon,
  PieChart as PieChartIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { useAtomValue } from 'jotai';
import { navBarOpenAtom } from '../';

export default function NavBarContent() {
  const { pathname } = useLocation();
  const navBarOpen = useAtomValue(navBarOpenAtom);

  const menuOpen = pathname.startsWith('/someRandom');

  return (
    <List component="nav">
      <ListItemButton
        component={RouterLink}
        to={'/exampleComponentDemo'}
        selected={pathname === '/exampleComponentDemo'}
      >
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary="Example Component" />
      </ListItemButton>

      <ListItemButton
        component={RouterLink}
        to={'/saladBarDemo'}
        selected={pathname === '/saladBarDemo'}
      >
        <ListItemIcon>
          <DraftsIcon />
        </ListItemIcon>
        <ListItemText primary="SaladBar Demo" />
      </ListItemButton>

      <ListItemButton
        component={RouterLink}
        to={'/specialDemo'}
        selected={pathname === '/specialDemo'}
      >
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="NavBarTop Demo" />
      </ListItemButton>

      <ListItemButton
        component={RouterLink}
        to={'/domaincode'}
        selected={pathname === '/domaincode'}
      >
        <ListItemIcon>
          <PieChartIcon />
        </ListItemIcon>
        <ListItemText primary="DomainCode Demo" />
      </ListItemButton>

      <ListItemButton
        component={RouterLink}
        to={'/someRandom#top'}
        selected={pathname.startsWith('/someRandom')}
      >
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Random Page" />
        {menuOpen && navBarOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={menuOpen && navBarOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 2 }} component={RouterLink} to={'/someRandom#step1'}>
            <ListItemText primary="1. Something" inset />
          </ListItemButton>
          <ListItemButton sx={{ pl: 2 }} component={RouterLink} to={'/someRandom#step2'}>
            <ListItemText primary="2. Something else" inset />
          </ListItemButton>
          <ListItemButton sx={{ pl: 2 }} component={RouterLink} to={'/someRandom#step3'}>
            <ListItemText primary="3. Puppies!" inset />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}

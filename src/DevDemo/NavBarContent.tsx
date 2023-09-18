import {
  Search as AutoCompleteDemoIcon,
  PieChart as DomainCodeDemoIcon,
  Send as ExampleComponentIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Add as NavBarTopDemoIcon,
  Inbox as RandomPageIcon,
  Drafts as SaladBarDemoIcon,
  BorderTop as TopBarMiddleDemoIcon,
} from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useAtomValue } from 'jotai';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { navBarOpenAtom } from 'ag-internal-components';

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
          <ExampleComponentIcon />
        </ListItemIcon>
        <ListItemText primary="Example Component" />
      </ListItemButton>

      <ListItemButton
        component={RouterLink}
        to={'/saladBarDemo'}
        selected={pathname === '/saladBarDemo'}
      >
        <ListItemIcon>
          <SaladBarDemoIcon />
        </ListItemIcon>
        <ListItemText primary="SaladBar Demo" />
      </ListItemButton>

      <ListItemButton
        component={RouterLink}
        to={'/navBarTopDemo'}
        selected={pathname === '/navBarTopDemo'}
      >
        <ListItemIcon>
          <NavBarTopDemoIcon />
        </ListItemIcon>
        <ListItemText primary="NavBarTop Demo" />
      </ListItemButton>

      <ListItemButton
        component={RouterLink}
        to={'/topBarMiddleDemo'}
        selected={pathname === '/topBarMiddleDemo'}
      >
        <ListItemIcon>
          <TopBarMiddleDemoIcon />
        </ListItemIcon>
        <ListItemText primary="TopBarMiddle Demo" />
      </ListItemButton>

      <ListItemButton
        component={RouterLink}
        to={'/domaincode'}
        selected={pathname === '/domaincode'}
      >
        <ListItemIcon>
          <DomainCodeDemoIcon />
        </ListItemIcon>
        <ListItemText primary="DomainCode Demo" />
      </ListItemButton>

      <ListItemButton
        component={RouterLink}
        to={'/autocomplete'}
        selected={pathname === '/autocomplete'}
      >
        <ListItemIcon>
          <AutoCompleteDemoIcon />
        </ListItemIcon>
        <ListItemText primary="Autocomplete Demo" />
      </ListItemButton>

      <ListItemButton
        component={RouterLink}
        to={'/someRandom#top'}
        selected={pathname.startsWith('/someRandom')}
      >
        <ListItemIcon>
          <RandomPageIcon />
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

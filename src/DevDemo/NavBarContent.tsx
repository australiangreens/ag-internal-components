import { ListItemButton, ListItemText, ListItemIcon, List, Collapse } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Inbox as InboxIcon,
  Drafts as DraftsIcon,
  Send as SendIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

// interface NavBarContentProps {}

export default function NavBarContent() {
  const { pathname } = useLocation();
  // const [open, setOpen] = useState(false);

  // const handleClick = () => {
  //   setOpen((prev) => !prev);
  // };

  const open = pathname.startsWith('/someRandom');

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
        to={'/someRandom#top'}
        selected={pathname.startsWith('/someRandom')}
      >
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Random Page" />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
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

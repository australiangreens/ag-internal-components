import CssBaseline from '@mui/material/CssBaseline';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink } from 'react-router-dom';
import ListIcon from '@mui/icons-material/List';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation } from 'react-router-dom';

import DarkStyledList from './DarkStyledList';
import { classes, Root, NavDrawer } from './Styling';

export { NAVBAR_WIDTH_OPENED, NAVBAR_WIDTH_CLOSED } from './Styling';

const iconTableItems = [
  {
    label: 'ExampleComponentDemo',
    destPathname: '/ExampleComponentDemo',
    icon: HomeIcon,
  },
  {
    label: 'SaladBarDemo',
    destPathname: '/SaladBarDemo',
    icon: ListIcon,
  },
];

type NavbarProps = {
  open?: boolean;
};

export default function Navbar({ open = false }: NavbarProps) {
  const { pathname } = useLocation();

  return (
    <Root className={classes.root}>
      <CssBaseline />
      <NavDrawer
        variant="permanent"
        anchor="left"
        // We aren't using transitions, and {0} will still create an unwanted timeout
        transitionDuration={null as unknown as number}
        open={open}
      >
        <nav>
          <h1>This is the NavBar</h1>
          <DarkStyledList>
            {iconTableItems.map((iconTableItem) => (
              <ListItem key={iconTableItem.label}>
                <ListItemButton
                  component={RouterLink}
                  to={iconTableItem.destPathname}
                  selected={pathname === iconTableItem.destPathname}
                >
                  <ListItemIcon>
                    <iconTableItem.icon />
                  </ListItemIcon>
                  <ListItemText primary={iconTableItem.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </DarkStyledList>
        </nav>
      </NavDrawer>
    </Root>
  );
}

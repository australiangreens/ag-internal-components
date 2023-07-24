import { Link as RouterLink } from 'react-router-dom';
import { ListItemButton, ListItem, ListItemText, ListItemIcon, IconButton } from '@mui/material';
import {
  List as ExampleIcon,
  Home as SaladIcon,
  ViewHeadline as HamburgerIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

import { NavBarDarkStyledList, useNavBar } from '../components/NavBar';

const iconTableItems = [
  {
    label: 'ExampleComponentDemo',
    destPathname: '/ExampleComponentDemo',
    icon: ExampleIcon,
  },
  {
    label: 'SaladBarDemo',
    destPathname: '/SaladBarDemo',
    icon: SaladIcon,
  },
];

export default function NavBarContent() {
  const { pathname } = useLocation();
  const { toggleOpen: toggleNavBar } = useNavBar();

  return (
    <nav>
      <IconButton color="inherit" onClick={toggleNavBar}>
        <HamburgerIcon />
      </IconButton>
      <h1>This is the NavBar</h1>
      <NavBarDarkStyledList>
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
      </NavBarDarkStyledList>
    </nav>
  );
}

import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink } from 'react-router-dom';
import ListIcon from '@mui/icons-material/List';
import HomeIcon from '@mui/icons-material/Home';

import { useLocation } from 'react-router-dom';

import { NavBarDarkStyledList } from '../components/NavBar';

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

export default function NavBarContent() {
  const { pathname } = useLocation();

  return (
    <nav>
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

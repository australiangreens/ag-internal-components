import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListIcon from '@mui/icons-material/List';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink, MemoryRouter, useLocation } from 'react-router-dom';

import NavBar, { NavBarProvider, NavBarDarkStyledList } from '.';

const meta = {
  component: NavBar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <NavBarProvider>
          <Story />
        </NavBarProvider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    children: {
      control: { type: null },
      description: 'Contents of the navbar',
    },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const iconTableItems = [
  {
    label: 'Home page',
    destPathname: '/home',
    icon: HomeIcon,
  },
  {
    label: 'Some list page',
    destPathname: '/list',
    icon: ListIcon,
  },
];

function NavBarContent() {
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

export const WithContent: Story = {
  args: {
    children: (
      <Box sx={{ height: 200 }}>
        <NavBarContent />
      </Box>
    ),
    'data-testid': 'NavBar',
  },
};

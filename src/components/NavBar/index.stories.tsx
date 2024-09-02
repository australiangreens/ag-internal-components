import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import { Box } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Controls, Description, Primary, Stories, Title } from '@storybook/blocks';
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Link as RouterLink, useLocation } from 'react-router-dom';

import NavBar, { NavBarDarkStyledList, NavBarProvider } from '.';

// TODO: It shouldn't be encessary to have this explicit type annotation here.
// It is a workaround for https://github.com/microsoft/TypeScript/issues/48212
const meta: Meta<typeof NavBar> = {
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
      control: { type: undefined },
      description: 'Contents of the navbar',
    },
  },

  // Below generates (more or less) the same as the default autodocs template
  // does. Just want to add a note saying it might look weird.
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      page: () => (
        <>
          <Title />
          <p>
            <em>
              Note: The navbar won&apos;t show up correctly on this page. Open the With Content
              story instead.
            </em>
          </p>
          <Description />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
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

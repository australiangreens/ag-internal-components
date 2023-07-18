import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import {ListItemButton, ListItem, ListItemText, ListItemIcon  } from '@mui/material';
import { List as Page1Icon,  Home as Page2Icon} from '@mui/icons-material';
import { Link as RouterLink, MemoryRouter, useLocation } from 'react-router-dom';
import { Description,  Stories, Markdown} from '@storybook/blocks';

import PageLayout from '.';
import Readme from './README.md?raw';
import NavBar, {
  NavBarProvider,
  NavBarDarkStyledList,
  NAVBAR_WIDTH_OPENED,
  NAVBAR_WIDTH_CLOSED,
} from '../../components/NavBar';

const iconTableItems = [
  {
    label: 'Home page',
    destPathname: '/page1',
    icon: Page1Icon,
  },
  {
    label: 'Some list page',
    destPathname: '/page2',
    icon: Page2Icon,
  },
];

const meta = {
  component: PageLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // Below generates (more or less) the same as the default autodocs template
    // does. Just want to add a note saying it might look weird.
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      page: () => (
        <>
          {/* <Title /> */}
          <h1>Original readme</h1>
          <Markdown>{Readme}</Markdown>
          <Description />
          {/* <Primary /> */}
          {/* <Controls /> */}
          <Stories />
        </>
      ),
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Box display="flex" flexDirection="column" height="100vh">
          <Box display="flex" position="relative" flexGrow={1} overflow="hidden">
            <NavBarProvider>
              <NavBar>
                <NavBarContent />
              </NavBar>
              <Box component="main" id="main-content" flexGrow={1} overflow="auto" tabIndex={-1}>
                <Story />
              </Box>
            </NavBarProvider>
          </Box>
        </Box>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    children: {
      control: { type: null },
      description: 'Contents of the navbar',
    },
  }

} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

function NavBarContent() {
  const { pathname } = useLocation();

  return (
    <Box>
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
    </Box>
  );
}

function PageContent() {
  return (
    <p>Hello this is a longer sentence something strange is going on here why is it not working</p>
  );
}

export const WithContent: Story = {
  args: {
    navBarWidthOpen: NAVBAR_WIDTH_OPENED,
    navBarWidthClosed: NAVBAR_WIDTH_CLOSED,
    children: <PageContent />,
  },
};

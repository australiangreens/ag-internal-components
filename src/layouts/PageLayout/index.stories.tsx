import { Home as Page1Icon, List as Page2Icon } from '@mui/icons-material';
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Description, Markdown, Stories } from '@storybook/blocks';
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Link as RouterLink, useLocation } from 'react-router-dom';

import PageLayout from '.';
import NavBar, {
  NAVBAR_WIDTH_CLOSED,
  NAVBAR_WIDTH_OPENED,
  NavBarDarkStyledList,
  NavBarProvider,
} from '../../components/NavBar';
import Readme from './README.md?raw';

const iconTableItems = [
  {
    label: 'Home page',
    destPathname: '/page1',
    icon: Page1Icon,
  },
  {
    label: 'Link to another page',
    destPathname: '/page2',
    icon: Page2Icon,
  },
];

// TODO: It shouldn't be encessary to have this explicit type annotation here.
// It is a workaround for https://github.com/microsoft/TypeScript/issues/48212
const meta: Meta<typeof PageLayout> = {
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
      control: { type: undefined },
      description: 'Contents of the navbar',
    },
  },
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
    <>
      <p>
        Notice how at the moment the position of the left panel depends on navBarOpen,
        navBarWidthOpen and navBarWidthClosed.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam laoreet hendrerit mauris.
        Sed tempus eros sed est pellentesque sagittis. Aliquam sed sagittis arcu, quis sollicitudin
        quam. Donec ac ligula volutpat, pellentesque purus eu, lobortis massa. Vivamus id
        scelerisque libero. In pretium mollis tincidunt. Maecenas vitae consectetur metus. Donec et
        augue tempor, fringilla erat et, auctor lorem. Fusce in augue viverra tellus imperdiet
        vehicula. Integer tempor imperdiet leo. Nulla ut mi porttitor, interdum sem non, bibendum
        ante. Ut scelerisque vehicula tellus, nec congue tellus laoreet a. Phasellus convallis dolor
        at vestibulum lacinia. Pellentesque a pharetra enim. Etiam efficitur tellus at tellus
        posuere scelerisque. In iaculis sed ligula vel molestie.
      </p>
    </>
  );
}

export const Playground: Story = {
  // Kludge to avoid "is not assignable to type 'never'"
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  args: {
    titleText: 'Title of page',
    children: <PageContent />,

    navBarOpen: true,
    navBarWidthOpen: NAVBAR_WIDTH_OPENED,
    navBarWidthClosed: NAVBAR_WIDTH_CLOSED,

    leftPanel: {
      titleText: 'Left Panel',
      content: <Box sx={{ paddingLeft: '16px' }}>Some content</Box>,
      flavour: 'push',
      arrowButtons: 'both',
      startOpen: true,
    },

    rightPanel: {
      titleText: 'Right Panel',
      content: <Box sx={{ paddingRight: '16px' }}>Some content</Box>,
      flavour: 'push',
      arrowButtons: 'both',
      startOpen: false,
    },
  },
};

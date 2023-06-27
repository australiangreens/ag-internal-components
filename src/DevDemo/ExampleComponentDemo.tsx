import { useContext } from 'react';

import { PageLayout, ExampleComponent } from '..';
import { NAVBAR_WIDTH_OPENED, NAVBAR_WIDTH_CLOSED } from './NavBar';
import { NavbarContext } from '.';

export default function ExampleComponentDemo() {
  const { open: navBarOpen } = useContext(NavbarContext);

  return (
    <PageLayout
      titleText={'ExampleComponent'}
      navBarOpen={navBarOpen}
      navBarWidthOpen={NAVBAR_WIDTH_OPENED}
      navBarWidthClosed={NAVBAR_WIDTH_CLOSED}
    >
      <ExampleComponent text="Some text" />
    </PageLayout>
  );
}

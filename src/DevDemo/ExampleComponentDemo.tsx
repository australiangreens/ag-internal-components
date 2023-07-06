import { PageLayout, ExampleComponent } from '..';
import { NAVBAR_WIDTH_OPENED, NAVBAR_WIDTH_CLOSED } from './NavBar';
import { useNavBar } from '..';

export default function ExampleComponentDemo() {
  const { open: navBarOpen } = useNavBar();

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

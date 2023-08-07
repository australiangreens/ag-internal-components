# NavBar

## Overview

The NavBar has three sections: top, middle and bottom. Only the middle is
required. The basic idea is the top content is related to the current page being
displayed (where needed), while the middle is common to all pages in the app.
The bottom section is stickied to the bottom of viewport, and displays
information that is (more or less) common across all apps making use of the
AppLayout component.

## Usage

The `NavBar` is not designed to be used directl, instead sitting below the
`TopBar` within the `AppLayout`. However it can still be used separately if
needed.

E.g.

```jsx
import {NavBar, AppLayoutProvider} from '@australiangreens/ag-internal-components';
...

export function SomePageComponent() {
  const [navBarOpen, setNavBarOpen] = useState<boolean>(true);


  return (
      <NavBar open={navBarOpen}, widthOpen={256} widthClosed={64} >
      {/* Navbar contents */}
      </NavBar>

      <SomeSortOfContent>
      </SomeSortOfContent>
  );
}
```

## Planned improvements

Once we have solidified exactly how we want navbars to work across apps, rather
than providing the navbar contents as children, a list of links/icons etc will
be provided instead.

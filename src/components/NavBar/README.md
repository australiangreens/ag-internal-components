# NavBar

## Status

This is still needed for one of the apps, but newer ones are using AppLayout
that has different NavBar as a sub component.

## Usage

The `NavBar` component must be used within a `NavBarProvider`.

E.g.

```jsx
import {NavBar, NavBarProvider} from '@australiangreens/ag-internal-components';
...
  return (
    <NavBarProvider>
      <NavBar>
      {/* Navbar contents */}
      </NavBar>
      <PageLayout>
        {/* props */}
      </PageLayout>
    </NavBarProvider>
  );
```

## Planned improvements

Once we have solidified exactly how we want navbars to work across apps, rather
than providing the navbar contents as children, a list of links/icons etc will
be provided instead.

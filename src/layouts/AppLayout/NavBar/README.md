# NavBar

## Usage

The `NavBar` is not designed to be used directly. Instead it is used by the
`PageLayout` component within a `PageLayoutProvider`. However it can still be
used separately if needed:

E.g.

```jsx
import {NavBar, PageLayoutProvider} from '@australiangreens/ag-internal-components';
...
  return (
    <PageLayoutProvider>
      <NavBar>
      {/* Navbar contents */}
      </NavBar>
      <PageLayout
        {/* props */}
      </PageLayout>
    </PageLayoutProvider>
  );
```

## Planned improvements

Once we have solidified exactly how we want navbars to work across apps, rather
than providing the navbar contents as children, a list of links/icons etc will
be provided instead.

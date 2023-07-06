# NavBar

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
      <PageLayout
        {/* props */}
      </PageLayout>
    </NavBarProvider>
  );
```

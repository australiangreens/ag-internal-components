# ag-internal-components

Library of MUI react components used across various apps.

## Themes

If this library is imported, MUI styling modules will be augmented to support
changes needed for AG Themes. For example, the `NavBar` component requires the
custom `theme.navBar.backgroundColor` value to be in the theme context.

Generally, all that will be needed is to use a theme provider with the
`internalAgSystemsTheme` in the component hierarchy above any library
components:

```ts
import {internalAgSystemsTheme} from '@australiagreens/ag-internal-components';

<ThemeProvider theme={fed21Theme}>
  <App />
</ThemeProvider>
```

If an app needs to customise the theme further via `createTheme()`, either do a
[deep merge
with](https://mui.com/material-ui/customization/theming/#createtheme-options-args-theme)
with `internalAgSystemsTheme` or just ensure all required properties in the
`AgCustomTheme` interface are provided.

## Move to React 18

As over v0.0.50 we have moved from React 17 to React 18 (also Node 16 to Node
18). This breaks the peer dependency compatibility with some of our older apps.
They will need be upgraded in the future to use newer versions, but for now can
only use v0.0.50 of this library.

## Move to pnpm

Because it is faster than yarn.


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
import {internalAgSystemsTheme} from '@australiangreens/ag-internal-components';

<ThemeProvider theme={fed21Theme}>
  <App />
</ThemeProvider>
```

If an app needs to customise the theme further via `createTheme()`, either do a
[deep merge
with](https://mui.com/material-ui/customization/theming/#createtheme-options-args-theme)
with `internalAgSystemsTheme` or just ensure all required properties in the
`AgCustomTheme` interface are provided.

## The development environment

We are now at version 22 of node, with React 19 and Vite 7. We use pnpm for
development.

## Development with pnpm link

If you wish to give the latest version of `ag-internal-components` a red hot go with
your calling application (like ListManager), add this to its `package.json`, or
similar. (The part after `link:` will depend on your path on your machine.)

```
  "pnpm": {
    "overrides": {
      "@australiangreens/ag-internal-components": "link:/home/peter/projects/greens/ag-internal-components"
    }
  }
```

Then run `pnpm i`. (You may need to run `pnpm dev --force` first to get the app running.)

To disconnect it, remove this from ListManager's (or other
calling application's) `package.json`, and run `pnpm i` again; that will revert
to the installed `ag-internal-components` library.

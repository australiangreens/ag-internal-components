# ag-internal-components

## Regarding baseUrl

Using a `baseUrl` of 'src' in `tsconfig.json` would allow use to non-relative
modules names. E.g. `import AgThemeProvider from 'components/AgThemeProvider';`.
However we don't do this because it messes up our Rollup `external` option in
`vite.config.ts`. That relies on all local imports to start with a '.', to avoid
a problem with bundling dependencies and replacing external import paths with
local paths.

There is undoubtedly a better way of doing it, and in the future we can fix
this. However at the time it was not a priority.

Also, each component will likely be relatively stand alone, so using relative
paths for local imports unlikely to be arduous, at least in the near term.

## Regarding typing of thing like "Root = styled(...)"

At the time of writing, with typescript 5.0.2, this project is affected by a
typescript issue involved nested package types, which in particular crops up
when uses MUI's `styled()` utility.

For example you have the following component defined as:

```ts
import { styled} from '@mui/system';
import { Box } from '@mui/material';

export const Root = styled(Box, {
  name: 'NavBar',
})(({ theme }) => ({
  // ... object containing styling
}));
```

You'll get a typescrypt error along the lines of:

```text
src/components/NavBar/Test.tsx(4,14): error TS2742: The inferred type of
'Root' cannot be named without a reference to
'.pnpm/@mui+system@5.14.5_@emotion+react@11.11.1_@emotion+styled@11.11.0_
@types+react@18.2.0_react@18.2.0/node_modules/@mui/system'. This is likely not
portable. A type annotation is necessary.
```

This is currently an open issue:
<https://github.com/microsoft/TypeScript/issues/48212>, related to nested
modules. It is currently milestoned to be resolved in 5.1.0, but that was
already pushed out from 4.8.0

There are many workarounds, but the one we landed on was to use a type
annotation as the warning says. The component would then be defind as:

```ts
import { styled } from '@mui/material/styles'; // Not @mui/system
import { Box, BoxProps } from '@mui/material';
import { StyledComponent } from '@emotion/styled';

export const Root:StyledComponent<BoxProps> = styled(Box, {
  name: 'NavBar',
})(({ theme }) => ({
  // ... object containing styling
}));
```

## Linking a local copy into an app

Use the README recipe: a `pnpm.overrides` `link:` entry in the *consuming*
app, then `pnpm i`. Remove the override and `pnpm i` again to go back to the
published package. That round-trip was checked against a throwaway consumer on
pnpm 10.30.3 (symlink to this repo while the override is present; store copy
after it is removed). It was not re-run inside ListManager or EventsManager.

`pnpm link` is a weaker second option. On pnpm 10.30.3:

```sh
# in this repo — registers the package in the global store
pnpm link

# in the consuming app — node_modules then points at this repo
pnpm link @australiangreens/ag-internal-components
```

`pnpm link` warns that this library's peerDependencies will not be resolved
from the app (duplicate React / invalid hook call). There is no `--global`
flag in `pnpm help link`. `pnpm link --global <name>` from the app errors
(`Symlink path is the same as the target path`).

`pnpm unlink` / `pnpm unlink <name>` does **not** undo the app-side link
(prints `Nothing to unlink`; the symlink stays). What did restore the
published copy in the probe is:

```sh
pnpm add @australiangreens/ag-internal-components@^0.6.1
```

Drop the global registration with:

```sh
pnpm uninstall --global @australiangreens/ag-internal-components
```

not `pnpm unlink --global`.

## Typescript module augmentation

Things like `declare module '@mui/material/styles' {` aren't included in
typescript output, so we have a script to copy them over.

Any files named `augmentations.d.ts` will be concatenated into `dist/index.d.ts`
after a build. This is exported by the main entry point.

Be careful with any import statements - the paths will not be resolved, just
copied verbatim.

This was first done for the AgThemeProvider component, which adds new variants
to MUI's Typography component. For the typing to work, we need to use module
augmentation as per
<https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants>

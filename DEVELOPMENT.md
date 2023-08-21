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

## Yarn/npm linking

TODO: Currently experimenting with [pnpm](https://pnpm.io) so this is out of
date.

To use this project for development without publishing new versions, we can use
`yarn link` to essentially create a symlink between the local folder and the
node modules.

Complications can arise due to peer dependencies. Ending with errors along the
lines of:

> Error: Invalid hook call. Hooks can only be called inside of the body of a
> function component

This is due to multiple versions of react co-existing. Similar things can
happen with other peer dependencies such as material-ui.

To avoid these issues, we link not just the library but the peer dependencies
too. As well as some testing related things.

### To link the library to another project

In this project, run:

```sh
yarn link &&\
cd node_modules/react &&\
yarn link &&\
cd ../react-dom  &&\
yarn link  &&\
cd ../@mui/material &&\
yarn link &&\
cd ../icons-material &&\
yarn link &&\
cd ../../@emotion/react &&\
yarn link &&\
cd ../styled &&\
yarn link &&\
cd ../../@testing-library/react &&\
yarn link
```

and then in the project using the library as a dependency, run:

```sh
yarn link "@australiangreens/ag-internal-components" &&\
yarn link react &&\
yarn link react-dom &&\
yarn link "@mui/material" &&\
yarn link "@mui/icons-material" &&\
yarn link "@emotion/react" &&\
yarn link "@emotion/styled" &&\
yarn link "@testing-library/react"
```

### Unlinking

In the project using the library as a dependency, run:

```sh
yarn unlink react &&\
yarn unlink react-dom &&\
yarn unlink "@mui/material" &&\
yarn unlink "@mui/icons-material" &&\
yarn unlink "@emotion/react" &&\
yarn unlink "@emotion/styled" &&\
yarn unlink "@testing-library/react" &&\
yarn unlink "@australiangreens/ag-internal-components" &&\
yarn install --force
```

There is no need to unlink things on in `ag-internal-components`.

If you are unsure if everything is properly unlinked, you can check using:

```sh
npm ls --link=true
```

If you still run into problems after unlinking, removing the `node_modules`
directory and re-running `yarn` might be the best solution.

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

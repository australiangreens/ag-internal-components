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

## Yarn/npm linking

I kept running into issues when trying to work on this library and test that it
can be properly imported into our of our apps by using `yarn link`.
Specifically, would get an error that starts with:

> Error: Invalid hook call. Hooks can only be called inside of the body of a
> function component

Turns out its not expected to work. It causes multiple copy of react to exist:
<https://github.com/facebook/react/issues/14257>.

So don't try it like I did, unless you make use of the workarounds mentioned in
the issue.

## Typescript module augmentation

Any files named `augmentations.d.ts` will be concatenated into
`dist/augmentations.d.ts` after a build. This is exported by the main entry
point.

This was first done for the AgThemeProvider component, which adds new variants
to MUI's Typography component. For the typing to work, we need to use module
augmentation as per
<https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants>

Things like `declare module '@mui/material/styles' {` aren't included in
typescript output, so we have a script to copy them over.

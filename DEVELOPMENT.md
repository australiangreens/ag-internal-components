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

To use this project for development without publishing new versions, we can use
`yarn link` to essentially create a symlink between the local folder and the
node modules.

I kept running into issues when trying to work on this library and test that it
can be properly imported into our of our apps by using `yarn link`.
Specifically, would get an error that starts with:

> Error: Invalid hook call. Hooks can only be called inside of the body of a
> function component

Turns out its not expected to work. It causes multiple copy of react to exist:
<https://github.com/facebook/react/issues/14257>.

### To link the library to another project

In this project, run:

```sh
yarn link
```

In the project you have the library as a dependency, run:

```sh
yarn link "@australiangreens/ag-internal-components"
```

To solve the issue of multiple react and mui versions, in this project, run:

```sh
cd node_modules/react
yarn link
cd ../react-dom
yarn link
cd ../@mui/material
yarn link
```

and then in same project as before, run:

```sh
yarn link react
yarn link react-dom
yarn link "@mui/material"
```

Note: At time of writing, this was the minimum needed to work. If you have
future issues, try linking the rest of the packages in `peerDependencies`.

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

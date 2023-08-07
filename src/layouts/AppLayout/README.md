# AppLayout

The AppLayout component is a replacement for the old PageLayout component.

It has changed significantly. It is designed to sit above the Page components,
with its only child being `<Routes>` and integrates the NavBar directly.

Additionally, hooks are now used to pass data up to the AppLayout, rather than
Pages passing props down. The main motivation for this is that most pages don't
need to pass any data.

## Usage

Typically it will be the only child within the component during the routing, and
itself contain the conditionally rendered pages depending on the route. E.g.

```ts
<BrowserRouter>
  <AppLayout
    navBarMiddle={<NavBarContent />}
    initialNavBarOpen={true}
    initialTitleText="OurAppName"
  >
    <Routes>
      <Route index element={<ExampleComponentDemo />} />
      <Route path="/exampleComponentDemo" element={<ExampleComponentDemo />} />
      <Route path="/saladBarDemo" element={<SaladBarDemo />} />
      <Route path="/someRandom" element={<SomeRandomDemo />} />
    </Routes>
  </AppLayout>
</BrowserRouter>
```

## Expected future changes

The navbar design for the next project has changed for the next project, and
more strongly adheres to Material Design guidelines. If we backport this to the
list manager, we can simplify the AppLayout somewhat.

In addition, it may make more sense to separate out the side panel components
from the AppLayout entirely, and have them as separate components some Pages
can make use of (due to simplifcation as mentioned above). However at time of
writing this was not yet feasible. Instead they have simply been removed.

The way navBarMiddle works is planned to have a standardised array of items that
will build the menu, rather than it being provided as a ReactNode.

### Context

Will change from using context for the hooks to using
[jotai](https://www.npmjs.com/package/jotai)

--------------------------------------------------------------------------------

**!!!THE DOCUMENTATION BELOW THIS POINT IS NO LONGER UP TO DATE!!!**

--------------------------------------------------------------------------------

## Props

- **navBarMiddle** - Required. The contents for the middle, common-to-all-pages
  content of the navabar. In the future this will be provided as a standardised
  array of items, but at the moment its just a `ReactNode`.

- **initialTitleText** - Optional. The initial titleText. Shortcut for calling a
  setter from useAppLayout() hook since its such a common action. The reason it
  is not a simple prop is because individual pages typically need to modify it.

- **initialNavBarOpen** - Optional. The initial open state of the navbar, which
    is true by default. Shortcut for calling a setter from useAppLayout() hook
    since its such a common action.

- **pageContainerProps** - Optional. The PageContainer component is a styled MUI
  Container, and supports the same props.

- **topBarDataTestId** - Optional. Passed along as value for `data-testid` for
  the top bar component.

- **pageContentDataTestId** - Optional. Passed along as value of `data-testid`
  for the direct parent of the children passed in.

- **navBarDataTestId** - Optional. Passed along as value of `data-testid`
  for the nav bar.

## Testing

(Assuming using `@testing-library/dom`)

If buttons have the same name in the panels and page content, you can use the
various dataTestId props to make the tests simpler and yet still expressive.

For example, if you had an button in the main page labelled "Assign" that opens
a panel about assignments, which then itself has a button also labelled "Assign"
and you wanted to ensure it was disabled when the panel was opened, the
following will not work:

```ts
expect(screen.getByRole('button', { name: 'Assign' })).toBeDisabled();
```

Instead you'd need something like:

```ts
expect(screen.getAllByRole('button', { name: 'Assign' })[1]).toBeDisabled();
```

or by adding a test id to the button on the page.

Instead can use the `pageContentDataTestId` prop to assign a `data-testid` value
to the container. For example, using "pageContent" allows the following to be
used in tests.

```ts
expect(within(screen.getByTestId('pageContent')).getByRole('button','Something')).toBeDisabled();
```

or if checking multiple items in the page

```ts
const withinPage = screen.getByTestId('pageContent');
expect(withinPage.getByRole('button','Something')).toBeDisabled();
...
expect(withinPage.getByText(...));
```

if you put the test id at a high level in your app (or in a test builder), this
will be consistent and readable.

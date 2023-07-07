# PageLayout component

This is designed to be a resuable component for all Pages.

It includes a TopBar component containing the page title and optionally 2 side
panels.

It should be used as the top level component on most pages.

It was _designed_ to work with a NavBar component on the left taking up space.
Information about it is provided via the `navBarOpen`, `navBarWidthOpen` and
`navBarWidthClosed` props. They way this works will be changed once the NavBar
itself is moved into this library.

By default the open/closed states of each panel are _uncontrolled_. Optional
props are provided if the parent component needs to know/control their state.

## Props

- **titleText** Required. The title of the page. Will be rendered in the TopBar
  component.

- **leftPanel** and **rightPanel** - Optional. Each are objects defining the
  side panels. See Panel Props below for explanation.

- **sidePanelsAreMutuallyExclusive** - Optional, default true. If true only one
  panel can be open at a time. If the left panel is already open, and then the
  right panel is opened, the left will be closed. When the right panel is
  closed, the previous state of the left panel will be restored.

- **topBarDataTestId** - Optional. Passed along as value for `data-testid` for
  the top bar component.

- **pageContentDataTestId** - Optional. Passed along as value of `data-testid`
  for the direct parent of the children passed in.

## Panel Props

- **titleText** - Required. The title of the panel.

- **arrowButtons** - Optional. Default 'both'. Controls whether the arrow
  buttons to control the open and controlled state of the panel are included.
  The open button is in the TopBar, while the close button is in the panel's
  header. Valid options are 'open', 'close', 'both' or 'none'.

- **flavour** - Optional. Default 'push'. If set to 'overlay', rather than the
  page content being resized to fit with the panel, the panel will slide out
  over the top. In this case, it is generally assumed that arrowButtons will be
  set to 'none' and the component will be controlled, but this is not enforced.

- **width** - Optional. The width of the panel when opened, in pixels. Default
    400.

- **content** - Required. A valid ReactNode. Defines what appears wihin the
  side panel when it is opened, below the header. Note that no padding is set by
  default.

- **startOpen** - Optional. By default when uncontrolled, the panel will start
  closed. Setting this to true will cause it to open immediately. Note this
  includes the transition.

- **open** - Optional. If provided, will override the internal state of the
  panel, allowing it to be controlled.

- **onChangeOpen** - Optional callback. Called when the arrow buttons (if
  present) are pressed. The new open state is provided as a boolean argument.

- **dataTestId** - Optional. Passed in as the `data-testid` value for the
    panel.

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

## Conceptual layout

The following ASCII diagram is how the components are laid out. TopBar,
LeftPanel, RightPanel and PanelAwareMargins are all sibilings within
PageLayout. Their styling puts them in the relative positions shown if the
flavour is 'push'.

PanelAwareMargins is a styled div changes margins depending on the states of
the left and right panel, using transitions.

PageContainer is just a styled MUI Container component which has no special
styling related to the panels.

```txt
┌───────────────────────────────────────────────────┐
│PageLayout                                         │
│                                                   │
│ ┌───────────────────────────────────────────────┐ │
│ │TopBar                                         │ │
│ └───────────────────────────────────────────────┘ │
│                                                   │
│ ┌──────────┐ ┌────────────────────┐ ┌───────────┐ │
│ │LeftPanel │ │PanelAwareMargins   │ │RightPanel │ │
│ │          │ │ ┌────────────────┐ │ │           │ │
│ │          │ │ │PageContainer   │ │ │           │ │
│ │          │ │ │                │ │ │           │ │
│ │          │ │ │ ...children... │ │ │           │ │
│ │          │ │ │                │ │ │           │ │
│ │          │ │ │                │ │ │           │ │
│ │          │ │ │                │ │ │           │ │
│ │          │ │ │                │ │ │           │ │
│ │          │ │ │                │ │ │           │ │
│ │          │ │ │                │ │ │           │ │
│ │          │ │ │                │ │ │           │ │
│ │          │ │ └────────────────┘ │ │           │ │
│ │          │ │                    │ │           │ │
│ └──────────┘ └────────────────────┘ └───────────┘ │
│                                                   │
└───────────────────────────────────────────────────┘
```

# SaladBar

TODO: Document the functionality rather than implementation details.

TODO: Fix typing in SaladBarContext. `enqueueNotification()` allows a string to
be passed in when it should be an object. Related to detecting when being used
outside appropriate context.

The SaladBar replaces MUI's Snackbar. It allows queuing up multiple toast
messages with simple hooks. It is similar to noistack, but does not have the
toasts sitting on top of each other, which is against material design. Instead
after one disappears, the next replaces it it.

## BASIC IMPLEMENTATION CONCEPT

Modelling it roughly on how the Auth0 provider works (but its much smaller!).
Essentially:

-   A Provider wraps the app (or most of it)
-   The provider tracks a queue of Notifications (with options)
-   The provider uses the queue to determine which is the current thing to display
-   The provider creates a react Context to make it possible for children to
  access the common variable. Note a context isn't exactly the same as state,
  but in our case its how it is used.
-   A custom useSaladBar hook is available to fetch the context, which
  contains the useful `enqueueNotification()` function.
-   Calling `enqueueNotification()` enqueue a message and some other stuff.

In this way each child using it doesn't need to maintain separate state.

### One global Snackbar component or one for each message?

There is a single Snackbar component and there is a queue of Snackbar
properties.

It may have also been possible to use a separate Snackbar component each time,
but the single component approach seemed easier. That is, I didn't do it as an
optimisation, but because the normal React way is to have a single component
which you control via props, so it seemed closer to something that was 'normal'
and hopefully less error prone.

### The Notification data object

Takes the form:

```js
{
  message: string,
  severity: string ('success'|'info'|'warning'|'error'),
  variant: string ('standard'|'outlined'|'filled'),
}
```

Any extra properties are passed as props to the Snackbar component, allowing
overriding things like autoHideDuration.

### The flow

The queue is accessed via `useRef()` hook, not a `useState()` hook, since it
is mutable and needs to be maintained between renders.

During each render, the `open` state is used to determine whether to show the
Snackbar or not. It starts off false. The Notification in the head of the queue
is used for the message and other props.

When `enqueueNotification()` is called (via a child component's useSaladBar
hook), the provided message and optional props are combined into a Notification
object and added to the end of the queue. If the queue was previously empty,
`setOpen(true)` is called, triggering a re-render in next cycle and starting the
display of the Snackbar.

Whenever the Snackbar's `onclose` callback is called (either due to timeout or
manual close), `setOpen(false)` is called, causing a re-render on next cycle and
starting the hiding the Snackbar. We want to retain the current Notification
message while the transition animation is still going. (Although probably does
make a different due to how rendering works)

Once the Snackbar's `onExited` callback is called (when the transition has
exited) we remove the current Notification from the queue, since the message is
no longer visible. If there is still something on the queue, then we call
`setOpen(true)`, causing the next Notification to be shown.

Using this pattern the full animation between messages happens. If we called
`setOpen(true)` immediately in the `onClose` callback instead, it would look to
user like the same Snackbar is there, but the message has just changed.

### Closing programatically

The `enqueueNotification()` function returns an auto-generated key. The hook
also provides a `removeNotification()` function, where that key can later be
provided.

This simply finds the notification in the queue and:

1. If it doesn't exist, does nothing.

2. If its at the front of the queue, close it (if its already being closed,
   doesn't matter)

3. If its not at the front of the queue, just remove it from the queue. No
   transition will be needed

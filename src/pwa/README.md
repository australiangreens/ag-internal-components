# PWA install hint

A dismissible banner that nudges mobile users to install the app to their home screen. Pairs with
[`@australiangreens/ag-vite-pwa`](https://github.com/australiangreens/ag-vite-pwa), which makes the
app installable in the first place.

- **Chrome / Android:** offers the browser's native install prompt (an Install button).
- **iOS:** there is no prompt, so it explains Share, then Add to Home Screen.
- Shown on small screens only, never once the app is installed, and hidden for 30 days after Dismiss.

## Use

Call `capturePwaInstallPrompt()` as early as possible, **before** anything awaits auth. Chrome fires
`beforeinstallprompt` once, shortly after load, and never replays it. A component that only mounts
after Auth0 has finished would otherwise miss it.

```tsx
// main.tsx
import { capturePwaInstallPrompt } from '@australiangreens/ag-internal-components';

capturePwaInstallPrompt();
```

Then render the banner somewhere that is always mounted (it positions itself `fixed`):

```tsx
import { InstallHint } from '@australiangreens/ag-internal-components';

<InstallHint appName="Greens Events" />;
```

Need a different UI? Use the hook instead:

```tsx
const { mode, promptInstall, dismiss } = usePwaInstall();
// mode: 'prompt' (native prompt available) | 'ios' (show instructions) | 'none'
```

## Notes

- The hook also calls `capturePwaInstallPrompt()` itself, so it works without the entry-point call,
  but only if the browser has not already fired the event by the time it mounts.
- iOS is detected by user agent (including iPadOS). Safari, Chrome and Firefox on iOS 16.4+ can all
  add to the home screen via Share; in-app browsers (Facebook, etc.) cannot, and still see the hint.
